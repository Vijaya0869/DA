import { MigrationInterface, QueryRunner } from "typeorm";

// city.name had a UNIQUE constraint on its own, but real US cities share
// names across different states (e.g. Franklin, Springfield) - the ~28k row
// seed file has ~3,600 same-name-different-state rows, so seeding always
// crashed on the first duplicate name and `city` ended up permanently empty.
// This replaces the constraint with a composite (name, state_id) unique
// index instead, which is what was actually intended.
export class FixCityUniqueConstraint1783650835281 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "city" DROP CONSTRAINT "UQ_f8c0858628830a35f19efdc0ecf"`);
        await queryRunner.query(`ALTER TABLE "city" ADD CONSTRAINT "UQ_city_name_state_id" UNIQUE ("name", "state_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "city" DROP CONSTRAINT "UQ_city_name_state_id"`);
        await queryRunner.query(`ALTER TABLE "city" ADD CONSTRAINT "UQ_f8c0858628830a35f19efdc0ecf" UNIQUE ("name")`);
    }

}
