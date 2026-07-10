# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This directory holds two independent, non-git-tracked projects that together make up the Dream Avenue app:

- `dreamavenue-main/api/` — NestJS backend (TypeORM + Postgres/PostGIS, Redis, BullMQ)
- `dreamavenue-ui-main/dream-avenue/` — React micro-frontend monorepo (webpack Module Federation, npm workspaces)
- `dreamavenue-roadmap.txt` — a phased fix/feature roadmap for the project (Phase 1 critical fixes → Phase 2 finish half-built features → Phase 3 tests → Phase 4 new features)

Neither project is a git repository, so there is no commit history or blame to consult — treat the working tree as the only source of truth.

## Running the stack locally

The frontend was originally hardcoded to call a remote server (`test.dreamavenue.ai/backend`) which is dead (502). A full local backend stack replaces it. To bring everything up from scratch:

```bash
# 1. Docker containers (Postgres/PostGIS + Redis), from dreamavenue-main/api/
docker compose up -d postgres redis
docker run -d --name mailhog -p 1025:1025 -p 8025:8025 mailhog/mailhog   # fake SMTP, web UI at :8025

# 2. Backend — MUST use Node 20, not a newer system default (Node 22+ breaks a JWT
#    dependency: buffer-equal-constant-time / SlowBuffer removed in later Node)
cd dreamavenue-main/api
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm run start:dev   # NestJS on :4000

# 3. Frontend, from dreamavenue-ui-main/dream-avenue/
npm start   # runs auth, main, property, ui, website dev servers concurrently
```

**Use `http://localhost:3002` (the `main` app) to exercise the app**, not the individual sub-app ports. Each micro-frontend has its own isolated router in dev; only `main` composes `website` + `auth` + `property` routes into a working whole. Visiting `website` alone (3004) and clicking Login/Sign Up navigates its own router to a route it doesn't have and renders blank.

`dreamavenue-main/api/.env` is required and gitignored — it is not recoverable from the repo. Notable keys: `DB_USER`/`DB_PASSWORD`/`DB_NAME` for Postgres, `JWT_SECRET`, `SMTP_*` pointed at MailHog, `LOAD_DATA=true` (required to seed master data on boot — see Known gotchas below), OAuth client IDs (dummy values are fine, but *some* value must be present or the app crashes on boot), `RENTCAST_API_KEY`/`DATAFINITI_API_KEY`/`HERE_API_KEY` (blank in dev — property search falls back to mock data via `DEV_MODE=true`).

## Backend (`dreamavenue-main/api`)

NestJS app, entry point `src/main.ts`. Key commands (run from `api/`):

```bash
npm run start:dev          # watch mode, port 4000
npm run lint                # eslint --fix over src/apps/libs/test
npm run test                # jest unit tests
npm run test -- <pattern>   # run a single test file/suite
npm run test:e2e            # jest e2e (test/jest-e2e.json)
npm run migration:generate -n <Name>   # generate a TypeORM migration from entity diffs
npm run migration:run                  # apply migrations (uses ormconfig.ts)
npm run migration:revert
```

Structure:
- `src/modules/` — one folder per domain: `auth`, `user`, `property`, `master` (reference data: states/cities/property types/investment strategies), `analysis`, `queue` (BullMQ), `report`, `bulk_upload`, `log-viewer`, `common`.
- `src/app.module.ts` is the composition root — import order here matters in this codebase (see gotcha below).
- `ormconfig.ts` (used by the `typeorm`/`migration:*` CLI scripts) and `src/config/database.config.ts` (used by `TypeOrmModule.forRoot()` at runtime) are two **separate, hand-maintained** DB configs — keep entity/migration globs in sync between them when changing build output paths.
- Auth uses Passport strategies under `modules/auth/strategies` (local, JWT, Google, Facebook) plus `guards/`. Note: `JwtAuthGuard` currently isn't applied to any controller — there is no enforced auth on API routes yet.
- Master/reference data (`city`, `state`, `property_type`, `investment_strategy`) is bulk-seeded by `MasterDataService.onModuleInit()`, gated entirely behind `process.env.LOAD_DATA` — seeding silently no-ops if that env var is unset.

### Known gotchas worth knowing before debugging something that "shouldn't be possible"

- **`main.ts` must load dotenv itself.** There's no explicit `import 'dotenv/config'` guarantee elsewhere; env vars can otherwise only get populated as a side effect of `ConfigModule.forRoot()` inside `modules/queue/bullmq.module.ts`, which is imported *after* `AuthModule`/mailer setup in `app.module.ts` — meaning anything read before that import point sees `undefined`.
- **`@nestjs-modules/mailer`'s `defaults.from` config does not apply in the installed version.** Set `emailDto.from` explicitly per call site (see `auth.controller.ts`) rather than relying on mailer module defaults.
- **The `city` table had a UNIQUE constraint on `name` alone**, not `(name, state_id)` — fixed via migration `1783650835281-FixCityUniqueConstraint`. The seed data (`src/data/cities.json`, ~28k rows) has genuine same-name cities in different states (~3,600 of them), so seeding used to crash on the first duplicate and `city` stayed permanently empty, which meant the City dropdown in "Enter Manually" always had zero options and the form could never be submitted. The seed file itself also had 16 rows that were genuine `(name, state_id)` duplicates (not just same-name-different-state) — those were removed from `cities.json` directly since they're redundant. City is now fully seeded (28,079 rows) and the dropdown populates correctly once a State is selected.
- **`google.strategy.ts`** returns the raw OAuth profile instead of calling `validateOAuthLogin` (the way `facebook.strategy.ts` does) — Google login never creates or looks up a user.
- **Bracket-notation query params (`filters[email]=x`) don't survive this app's request pipeline** — `req.query` ends up with a literal flat key `"filters[email]"` instead of a nested `filters: { email: 'x' }` object (traced down to raw Express `req.query`, so it's happening before Nest's validation layer even runs, not a `class-validator`/`class-transformer` issue). Anything using `SearchCriteria` (`filters`, `orderBy`) — `/users/GetUsersList`, `/property` — must instead pass a single JSON-encoded query param, e.g. `?filters={"lastName":"Johnson"}`. `search.criteria.ts` has a `@Transform` that JSON-parses these two fields; this is enforced there, not per-endpoint.
- **`SearchCriteria`-based `applyFilters` implementations must allowlist filterable columns** (see `user.service.ts`'s `FILTERABLE_COLUMNS`) — the filter object's *keys* come straight from client input and get spliced into the raw SQL string (TypeORM can't parameterize a column/field name), so an un-allowlisted key is a SQL injection vector. `property.service.ts`'s `applyFilters` does **not** do this yet — it accepts any key from `criteria.filters` unfiltered. Worth the same fix if that endpoint is ever exposed to less-trusted input.
- **RentCast/Datafiniti/the free enrichedrealestate.com scrape can each independently fuzzy-match a searched address to a *different* real property** when the exact address doesn't exist (they don't cross-validate against each other). `rentcast.service.ts`'s `getPropertyDataByAddressOrUniqueId` now discards the third-party scrape's data if its city/state doesn't match the parsed search target, rather than blending two unrelated properties' data into one record. `mergePropertyData` (the Datafiniti merge path) also used to overwrite its own careful field-by-field fallback merge with a blind `{ ...merged, ...rentcastData, ...datafinitiRecord }` spread at the end — fixed to just `return merged`. Datafiniti's path is currently dormant (`DATAFINITI_API_KEY` is blank), so that specific fix isn't exercised by any live traffic yet.
- **`util-service.ts`'s `parse()`** used to `throw` on anything that wasn't a full street address (needed exactly 4-6 comma parts, or 4+ space-separated tokens), which surfaced as a raw 500 for perfectly normal partial searches like "Springfield, IL" or just "Kentucky, United States". It now makes a best-effort assignment for 1-3 comma parts (recognizing a trailing "United States"/"USA"/"US" as a country rather than assuming city+state) and never throws — every input shape returns *something*, even if most fields end up empty. Relatedly, `getDataFromThirdPartyService`/the RentCast call in `rentcast.service.ts` had no request timeout and no surrounding try/catch, so an edge case like an empty address string would hang the request indefinitely rather than fail fast — both external calls now skip entirely on an empty address, have a 10s timeout, and are wrapped in try/catch returning `{}` on failure.
- **`property.service.ts`'s `syncUserTags()` used a Postgres `MERGE INTO` statement, but this DB runs Postgres 13** (`MERGE` was added in Postgres 15) — so it threw a SQL syntax error on *every single call*, meaning every `POST /property` (create) and any other path that calls `syncUserTags` always 500'd back to the client, even though the property row itself had already been successfully inserted and committed moments earlier in the same request. This was completely silent from the DB's perspective (the row is really there — check `SELECT * FROM property` if a "failed" save seems to be missing) and is likely responsible for a lot of "Add Property doesn't work" reports. Rewritten as a plain find-then-update-or-insert against the `UserTags` repository (works on any Postgres version); verified both the insert path (new user) and update path (merges a second property's tags into the existing row, deduplicated and sorted) work correctly. Note `UserTags`'s entity declares `userId` as `@PrimaryColumn`, but the actual `user_tags` table's real primary key is a separate `id` column with no unique constraint on `user_id` at all — schema/entity drift, harmless for the simple `find`/`update`/`insert` calls used here (they don't rely on primary-key semantics), but worth knowing if you touch this table again.
- **`AddProperty.tsx` (the manual entry / edit form) was only ever built and tested for editing an *existing*, already-saved property** — it derives `EditID` directly from `location.state.propertyDetails.id` and, the moment that's truthy, immediately fires `getHoldingCosts`/`getClosingCosts`/`getPurchaseCosts`/`getSellingCosts`/`getRehabCosts`/`getDocuments`/`getImages`/`getFinancing` against that id, and resolves `state`/`city` as if they were already master-table UUIDs. Nothing in the app navigated here with fresh (not-yet-saved) property data until the Search Property page's "Save Property" button was wired up — that's the first code path to exercise this gap, and it exposed it immediately (an external search result's `id` is the third-party source's own reference like `"14018-Arcadia-Rd-NE,-Albuquerque,-NM-87123"`, not a DB UUID, and `state`/`city` are plain codes/names like `"NM"`/`"Albuquerque"`, not master-table UUIDs — passing them through 500'd on load and broke the City dropdown). The fix (in `searchproperty.tsx`'s `handleSaveProperty`) is to strip `id`/`state`/`city` before handing off search-result data to this form, letting the user pick State/City from the dropdown normally (that path already works) rather than forcing in values that look right but aren't the type this component expects. If `AddProperty.tsx` ever grows a genuine "new property from external data" mode, this conflation is the thing to unwind first.
- **`AddProperty.tsx`'s Yup schema didn't require `investment_strategy_id`**, even though the backend's `CreatePropertyDto` always does (`@IsNotEmpty()`, unconditionally — the frontend's "Investment Strategy: Yes/No" toggle only enables/disables the picker UI, it doesn't make the field optional in any real sense). Submitting without picking a strategy wasted a round-trip and produced only a generic "Error adding property" toast with the real reason buried in a console-only Axios error — no inline field error to guide the user. Fixed by adding `.required(...)` to match the backend; now shows an inline "Investment Strategy is required" error before ever submitting.
- **`PropertyService.create()`'s geocoding step could take down the entire property save with a *misleading* 401.** After the property row is already inserted and committed, `create()` looks up the state/city and calls `getGeocode()` (the HERE Geocoding API) to fill in lat/lng and a formatted address. `HERE_API_KEY` is blank in this environment, so HERE returns 401, which `getGeocode()` re-throws as an `HttpException` with that same status — Nest returns it as this endpoint's own response code, and the frontend's Axios interceptor treats *any* 401 as "your session expired" and starts logging the user out, even though the property had already saved successfully and the failure has nothing to do with their login. This was invisible in earlier testing because bogus (non-UUID) `state` values happened to skip the vulnerable code path entirely (the geocode block only runs `if (state)` resolves to a real master-table row) — fixing the City constraint above is what made this reachable via the manual-entry form for the first time. Now wrapped in try/catch: geocoding failure just logs and the property save still succeeds (verified: property row correct, `geocode_response` left null, no error surfaced to the user). If you ever get a real `HERE_API_KEY`, geocoding will start actually working; until then, property pins on the map just won't have coordinates.
- **`AddProperty.tsx`'s `Finacingform()` sent `financing_of_type_id: ""` (empty string) instead of `null` for an unfilled financing row** — `POST /property/financing/create` then 500'd with `invalid input syntax for type uuid: ""`, since that endpoint's `@Body() createFinancingDtos: CreateFinancingDto[]` (a raw array) doesn't actually get validated by the global `ValidationPipe` the way a plain object body would, so the empty string sailed straight through to Postgres instead of being rejected cleanly as a 400. The `financingForms` state is seeded with one blank placeholder row by default, and the Purchase step submits it as-is even if the user never touches the Financing section at all — so this fired on *every* manual property creation, unconditionally. `loan_type_id` right next to it already had the correct `!= "" ? String(...) : null` guard; `financing_of_type_id` just never got the same treatment. Fixed to match. Verified: the full 4-step wizard (Property Description → Purchase → Rehab → Sale → Finish) now completes end-to-end and lands back on the Property List with no errors.

## Frontend (`dreamavenue-ui-main/dream-avenue`)

npm workspaces monorepo (`apps/*`), each app is an independent webpack 5 dev server wired together via Module Federation (`webpack/lib/container/ModuleFederationPlugin`). React 18 + TypeScript, Tailwind for styling, react-router-dom v6.

| App | Workspace | Port | Federation role |
|---|---|---|---|
| `container` (folder `apps/ui`) | shared components/utilities/styles | 3000 | exposes `./components`, `./arrayUtils`, `./storage`, `./stringUtils`, `./styles`; consumed by every other app as `container` |
| `website` | marketing/landing pages | 3004 | exposes `./WebRoutes`; consumes `container` |
| `auth` | login/signup | 3008 | exposes `./AuthRoutes`; consumes `container` |
| `property` | property search/dashboard | 3006 | exposes `./PropertyRoutes`; consumes `container` |
| `main` | shell app that composes everything | 3002 | consumes `container`, `auth`, `property`, `website` (all as remotes); this is the only app with all routes wired together |

Commands (from `dreamavenue-ui-main/dream-avenue/`):

```bash
npm start                              # all 5 apps concurrently (root script)
npm start --workspace=apps/<name>      # a single app's dev server
npm run build                          # build --workspaces --if-present
```

Each app also has `webpack --mode production`, `build:dev`, and `build:start` (serves the `dist/` build) scripts — see each app's own `package.json`.

Both `apps/auth/src/Axios/Axios.tsx` and `apps/property/src/Axios/Axios.tsx` hardcode `baseURL: "http://localhost:4000"` — this is the local NestJS backend. If the backend runs on a different host/port, both files need updating (there's no shared config/env indirection for this yet).

### Known gaps in the frontend (dead UI, not runtime bugs)

A number of nav items and buttons are scaffolded in the UI but never wired to a handler or route — e.g. a `Dashboard` import in `apps/main/src/App.tsx` (`./features/dashboard/dashboard`) that doesn't exist on disk. Before assuming a reported "button does nothing" issue is a logic bug, check whether the handler exists at all.

"Browse Properties" (landing/invest pages → `/property`), "Save Property" (search results → `/add-property`, prefilled via route state, see the `AddProperty.tsx` gotcha above), and "Compare" (Property List → select 2+ via checkboxes on `PropertyCard` → `/property/compare`, a new page at `pages/property/Compare/ComparePage.tsx` showing a simple side-by-side table) are now wired up.

Three features have full DB schema (tables exist) but zero backend implementation: **Fractional Investment**, **Marketing Campaigns**, and **AI-powered analysis** — don't expect a service/controller to exist for these yet.

### Sidebar items removed 2026-07-09 (`apps/ui/src/components/Sidebar/Sidebar.tsx`)

Dashboard, Fractional Investment, Marketing, Templates, and Resources were removed from the sidebar's `menuItems` array because none had a working route — only "Explore Property" had a `path`, so the rest just sat there doing nothing when clicked. The `.svg` assets themselves were left in place under `@/assets/images/`; only the imports and array entries in `Sidebar.tsx` were deleted. To bring any of them back once their route/page actually exists:

```tsx
// imports (paired icon + hover-icon per item)
import Dashboard from '@/assets/images/dashboard.svg';
import DashboardN from '@/assets/images/dashboard_n.svg';
import Fractional from '@/assets/images/fractional.svg';
import FractionalN from '@/assets/images/fractional_n.svg';
import Marketing from '@/assets/images/marketing.svg';
import MarketingN from '@/assets/images/marketing_n.svg';
import Template from '@/assets/images/template.svg';
import TemplateN from '@/assets/images/template_n.svg';
import Resources from '@/assets/images/resources.svg';
import ResourcesN from '@/assets/images/resources_n.svg';

// menuItems entries (original order: Explore Property, Dashboard, Fractional Investment, Marketing, Templates, Resources)
{
  name: "Dashboard",
  icon: DashboardN, hIcon: Dashboard,
  subItems: ["Rental", "Flip", "Wholesale", "Wholetail"],
},
{ name: "Fractional Investment", icon: FractionalN, hIcon: Fractional },
{ name: "Marketing", icon: MarketingN, hIcon: Marketing },
{ name: "Templates", icon: TemplateN, hIcon: Template },
{ name: "Resources", icon: ResourcesN, hIcon: Resources },
```

What's blocking each one from being real again:
- **Dashboard** — target page doesn't exist (`apps/main/src/App.tsx` imports `./features/dashboard/dashboard`, which isn't on disk). Its `subItems` (Rental/Flip/Wholesale/Wholetail) also render as plain `<li>`s with no click handler — those need routes too.
- **Fractional Investment** — matches the `fractional_investment` DB table, but no backend controller/service or frontend route exists yet.
- **Marketing** — matches `marketing_campaign`/`campaign_property` DB tables, same situation: no backend or frontend built.
- **Templates** / **Resources** — no matching backend feature found at all; unclear what these were originally meant to link to.

Don't re-add any of these with a real `path` until the underlying route/page exists — that's what caused them to be dead links in the first place.
