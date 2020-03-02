// Necessary import for typescript knexfiles
require("ts-node/register");

/* Knex Notes *
 *
 * Migrations:
 * 1. To make a new migration -> knex -x ts migrate:make <seed-file-name> --env development
 *
 * Seeding:
 * 1. To make a new seed file -> `knex -x ts seed:make <seed-file-name> --env development`
 * 2. To run the seed files:
 *   a. knex seed:run
 *   b. knex seed:run --specific=1.1-add_users.ts
 *
*/

module.exports = {
  development: {
    client: "pg",
    // TODO: Figure out why env variables are undef even when requiring in dotenv and config()'ing
    connection: "postgresql://malcolmnavarro@localhost/node_microservice_db",
    migrations: {
      tableName: "knex_migrations",
      directory: __dirname + "/migrations",
      extensions: "ts"
    },
    seeds: {
      directory: __dirname + "/seeds",
      extension: "ts"
    }
  }
};