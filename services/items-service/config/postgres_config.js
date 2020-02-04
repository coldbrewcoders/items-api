const { Pool } = require("pg");


// Connect to PostgreSQL DB
const postgresClient = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = {
  postgresClient
};