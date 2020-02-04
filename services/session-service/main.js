require("dotenv").config();

// Init JWT module and read key files
require("./repository/jwt");

// Init connection to Redis
require("./config/redis_config");

// Start gRPC server
require("./config/grpc_config");