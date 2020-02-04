require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");


// Init JWT module and read key files
require("./repository/jwt");

// Init connection to postgreSQL DB
require("./config/postgres_config");

// Init connection to Redis
require("./config/redis_config");

// Start gRPC server
require("./config/grpc_config");