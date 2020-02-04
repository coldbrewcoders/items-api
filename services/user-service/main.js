require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

// Utils
const genericErrorHandler = require("../utils/genericErrorHandler");


// Init connection to postgreSQL DB
require("./config/postgres_config");

// Start gRPC server
require("./config/grpc_config");


// Import REST API routes
const signupApi = require("./routes/signup");
const loginApi = require("./routes/login");
const logoutApi = require("./routes/logout");
const userAPI = require("./routes/user");


// Configure express server
const app = express();

// Apply global middleware
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Configure REST API routes
app.use("/api/signup", signupApi);
app.use("/api/login", loginApi);
app.use("/api/logout", logoutApi);
app.use("/api/user", userAPI);

// Generic error handler middleware
app.use(genericErrorHandler);

// Return 404 response if no route matched
app.use("*", (req, res) => void res.sendStatus(404).end());

// Initialize REST API server
const http = require("http").Server(app);

// Start API server
http.listen(process.env.USER_SERVICE_API_PORT, () => console.log(`User Service REST API server listening on port ${process.env.USER_SERVICE_API_PORT}`));