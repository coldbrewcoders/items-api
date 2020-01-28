const { Pool } = require("pg");


// connect to PostgreSQL DB
const postgresClient = new Pool({ connectionString: process.env.DATABASE_URL });


module.exports = {
  postgresClient
};