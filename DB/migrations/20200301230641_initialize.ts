import Knex from "knex";

// Schema names
const userServiceSchema: string = "user_service";
const itemsServiceSchema: string = "items_service";

export const up = async (knex: Knex): Promise<void> => {

  // Create User Service schema
  await knex.raw(`CREATE SCHEMA IF NOT EXISTS ${userServiceSchema};`);

  // Create UserRole type
  await knex.raw(`
    CREATE TYPE ${userServiceSchema}.user_roles AS ENUM (
      'BASIC', 'ADMIN'
    );
  `);

  // Create Users table
  await knex.raw(`
    CREATE TABLE ${userServiceSchema}.users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      role ${userServiceSchema}.user_roles NOT NULL DEFAULT 'BASIC',
      creation_date TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),

      CONSTRAINT check_email CHECK(LENGTH(email) > 0),
      CONSTRAINT check_password CHECK(LENGTH(password) > 0),
      CONSTRAINT check_first_name CHECK(LENGTH(first_name) > 0),
      CONSTRAINT check_last_name CHECK(LENGTH(last_name) > 0)
    );`
  );

  // Create ItemsService schema
  await knex.raw(`CREATE SCHEMA IF NOT EXISTS ${itemsServiceSchema};`);

  // Create Items table
  await knex.raw(`
    CREATE TABLE ${itemsServiceSchema}.items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      description VARCHAR NOT NULL,
      created_by_user_id INT NOT NULL REFERENCES ${userServiceSchema}.users(id) ON DELETE CASCADE,
      last_modified_by_user_id INT REFERENCES ${userServiceSchema}.users(id) ON DELETE SET NULL,

      CONSTRAINT check_name CHECK(LENGTH(name) > 0),
      CONSTRAINT check_description CHECK(LENGTH(description) > 0)
    );`
  );
}


export const down = async (knex: Knex): Promise<void> => {
  // Cascade delete the user and item service schemas
  await knex.raw(`DROP SCHEMA ${userServiceSchema} CASCADE;`);
  await knex.raw(`DROP SCHEMA ${itemsServiceSchema} CASCADE;`)
}