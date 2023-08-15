import { MigrationInterface, QueryRunner } from "typeorm";

export class CoffeeRefactor1664836898696 implements MigrationInterface {
  name = "CoffeeRefactor1664836898696";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "flavor" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_934fe79b3d8131395c29a040ee5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "coffees" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "brand" character varying NOT NULL, "recommendations" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_2c43a32ab6534261322aa94a76a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "event" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "name" character varying NOT NULL, "payload" json NOT NULL, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6e1de41532ad6af403d3ceb4f2" ON "event" ("name", "type") `,
    );
    await queryRunner.query(
      `CREATE TABLE "coffees_flavors_flavor" ("coffeesId" integer NOT NULL, "flavorId" integer NOT NULL, CONSTRAINT "PK_de39cb8561a47e3c64ac50ea880" PRIMARY KEY ("coffeesId", "flavorId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5dd9ae0f84ff324274aa15002c" ON "coffees_flavors_flavor" ("coffeesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ecbb972ad2487e83c677872b3e" ON "coffees_flavors_flavor" ("flavorId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "coffees_flavors_flavor" ADD CONSTRAINT "FK_5dd9ae0f84ff324274aa15002c0" FOREIGN KEY ("coffeesId") REFERENCES "coffees"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "coffees_flavors_flavor" ADD CONSTRAINT "FK_ecbb972ad2487e83c677872b3e5" FOREIGN KEY ("flavorId") REFERENCES "flavor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffees_flavors_flavor" DROP CONSTRAINT "FK_ecbb972ad2487e83c677872b3e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "coffees_flavors_flavor" DROP CONSTRAINT "FK_5dd9ae0f84ff324274aa15002c0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ecbb972ad2487e83c677872b3e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5dd9ae0f84ff324274aa15002c"`,
    );
    await queryRunner.query(`DROP TABLE "coffees_flavors_flavor"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6e1de41532ad6af403d3ceb4f2"`,
    );
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(`DROP TABLE "coffees"`);
    await queryRunner.query(`DROP TABLE "flavor"`);
  }
}
