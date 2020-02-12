import dotenv from "dotenv";
dotenv.config();

// Init JWT module and read key files
import "./repository/jwt";

// Init connection to Redis
import "./config/redis_config";

// Start gRPC server
import "./config/grpc_config";