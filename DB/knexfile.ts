import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(__dirname, "../.env") });


/* Knex Notes *
 *
 * Migrations:
 * 1. To make a new migration -> `knex -x ts migrate:make <seed-file-name> --env development`
 * 2. Running Migrations:
 *   a. `knex --knexfile [path] --env [environment to run on (default: process.env.NODE_ENV || 'development')] migrate:latest` --> Runs all migrations not yet run
 *   b. `... migrate:up`  --> Runs the next migration that has not yet been ran (or a specific migration)
 *   c. `... migrate:down`  --> Undo the last migration ran (or undo a specific migration)
 *   d. `... migrate:rollback`  --> Undo the last batch of migrations that has been ran
 *
 * Seeding:
 * 1. To make a new seed file -> `knex -x ts seed:make <seed-file-name> --env development`
 * 2. To run the seed files:
 *   a. `knex seed:run`
 *   b. `knex seed:run --specific=add_users.ts`
 *
*/

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      tableName: "knex_migrations",
      directory: resolve(__dirname, "./migrations"),
      extensions: "ts"
    },
    seeds: {
      directory: resolve(__dirname, "./seeds"),
      extension: "ts"
    }
  }
};