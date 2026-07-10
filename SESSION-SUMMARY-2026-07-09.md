# Dream Avenue — Session Summary (2026-07-09)

This covers everything done in this session, for picking back up later. See
`CLAUDE.md` for the technical gotchas in full detail (architecture, setup,
known issues) — this file is the higher-level "what happened and why."

## Starting point

- Local dev stack was already running (Docker Postgres/Redis/MailHog, NestJS
  backend, 5 frontend micro-frontend apps).
- Neither project was in git. By the end of this session, both are — the
  whole `Try/` directory is now one repo at `github.com/Vijaya0869/DA`
  (`main` branch), with real per-fix commit history from `a327d13` onward.

## The 8 tasks you asked for — all done and tested

1. **User search/filter** — implemented `applySearch`/`applyFilters` in
   `user.service.ts` (previously threw "not implemented"). Added a column
   allowlist to prevent SQL injection via filter keys. Found along the way:
   `filters`/`orderBy` query params can't be nested (`filters[email]=x`
   silently arrives as a flat key somewhere in this app's request
   pipeline) — fixed by accepting a single JSON-encoded query param instead.
2. **Address parser 500 on partial input** — `util-service.ts`'s `parse()`
   used to throw on anything short of a full street address. Now handles
   partial input gracefully. Also found and fixed: no timeout on the
   RentCast/enrichedrealestate.com calls meant an empty address could hang
   the request indefinitely instead of failing fast.
3. **Search results N/A / messy data** — `mapJsonToPropertyEntity()` was
   spreading raw third-party data over the cleaned fields (backwards).
   Fixed the spread order, added a proper `price` fallback, and exposed
   `numberOfFloors` (data existed, was just never surfaced).
4. **Cross-property data mixing** (found, not on your original list but
   directly caused the accuracy complaints) — when an address doesn't
   exist exactly, RentCast and the free enrichedrealestate.com scrape can
   each fuzzy-match to a *different* real property, and the code was
   blending both with no cross-check. Now discards the third-party match
   if its city/state disagrees with what you searched.
5. **Save Property / Compare buttons** — Save Property now hands off to
   the existing (but never-connected) `AddProperty.tsx` prefill mechanism.
   Compare is a new minimal feature: checkboxes on property cards + a
   side-by-side comparison page.
6. **City Constraint Bug** (the big one) — `city` had a UNIQUE constraint
   on `name` alone; ~3,600 real cities share names across states, so
   seeding always crashed and the City dropdown was permanently empty.
   Fixed via migration to a composite `(name, state_id)` constraint;
   also cleaned 16 genuine duplicate rows out of the seed file. City is
   now fully seeded (28,079 rows).
7. **Add Property logic** — the manual-entry wizard (4 steps: Property
   Description → Purchase → Rehab → Sale) now completes end-to-end and
   creates a real property. Fixed a financing-form bug (`""` instead of
   `null` for an empty foreign key) that crashed every submission.
8. **Browse Properties buttons** — wired to `/property` in
   `landingPage.tsx` and both `Invest.tsx` CTAs.

## Bonus fixes found while testing (not originally on your list, but real)

- **`syncUserTags()` used a Postgres `MERGE` statement — this DB runs
  Postgres 13, which doesn't have `MERGE` (added in 15).** Every single
  property save was silently succeeding in the database and then throwing
  a 500 anyway. This is probably the single biggest reason "Add Property
  doesn't work" — the data was fine, the response lied about it.
- **A geocoding failure could look exactly like an expired login.**
  `HERE_API_KEY` is blank, so the HERE API call inside property creation
  returns 401, which was getting passed straight through as this API's own
  response code — and the frontend treats any 401 as "log the user out."
  Now a non-fatal, best-effort step.
- **Property search was silently case-sensitive** — searching "Test"
  found nothing for a property titled "Test Property" (search term got
  lowercased, the DB column didn't, and Postgres `LIKE` is case-sensitive).
  Changed to `ILIKE`.
- **The dashboard header search bar was pure decoration** (no `onChange`,
  did nothing) — now navigates to the real, working property search.
- Sidebar cleanup: removed Dashboard/Fractional Investment/Marketing/
  Templates/Resources (dead links, nothing built behind them — full
  restoration instructions are in `CLAUDE.md` if you build those out
  later), plus some leftover dead icon imports.

## Still open / known limitations

- **Bedrooms/Bathrooms/Realtor.com Estimate** — bedrooms/bathrooms now
  work *if* you have a real, active RentCast API key with a subscription
  (you added one this session: `RENTCAST_API_KEY` in `.env`). Realtor.com
  Estimate has no integration at all — would be a new feature, not a fix.
- **Datafiniti integration is still dormant** — key is blank, so that
  code path (which had its own bug, now fixed) never actually runs.
- **`property.service.ts`'s `applyFilters`** doesn't allowlist columns the
  way `user.service.ts`'s now does — same SQL-injection-via-filter-key
  shape, just not fixed there yet.
- **Google OAuth is still broken** (`google.strategy.ts` doesn't call
  `validateOAuthLogin`) — not touched this session.
- **No route guards** — `JwtAuthGuard` exists but isn't applied anywhere.
- **Fractional Investment / Marketing Campaigns / AI-powered analysis** —
  DB tables exist, zero backend code. Untouched, matches the original
  roadmap's Phase 4.

## How to pick this back up

1. Follow the "Running the stack locally" section in `CLAUDE.md` to start
   Docker + backend + frontend.
2. `git pull` in `Try/` if working from a different machine — everything
   is committed to `github.com/Vijaya0869/DA`.
3. `CLAUDE.md`'s "Known gotchas" section has the full technical writeup of
   every bug above, with exact file/line references.
