import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PSWD,
  database: process.env.DB_NAME,
  entities: ["src/modules/**/*.entity.ts"],
  migrations: ["src/migrations/*.ts"],
});
