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


// // Import session REST API routes
// const sessionApi = require("./routes/session");

// // Apply global middleware
// app.use(logger("dev"));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// // Configure REST API routes
// app.use("/api/session", sessionApi);

// // Return 404 response if no route matched
// app.use("*", (req, res) => {
//   res.sendStatus(404).end();
// });

// // Initialize REST API server
// const http = require("http").Server(app);

// // Start API server
// http.listen(process.env.SESSION_SERVICE_API_PORT, () => console.log(`Session Service REST API server listening on port ${process.env.SESSION_SERVICE_API_PORT}`));


