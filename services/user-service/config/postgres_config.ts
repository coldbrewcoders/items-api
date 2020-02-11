import { Pool } from "pg";
import logger from "../../utils/Logger";


// Connect to PostgreSQL DB
const postgresClient: Pool = new Pool({ connectionString: process.env.DATABASE_URL });

postgresClient.on("connect", () => logger.info("POSTGRES CONNECTION ESTABLISHED"));

export { postgresClient };