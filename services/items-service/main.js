require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const compression = require("compression");

// Utils
const genericErrorHandler = require("../utils/genericErrorHandler");


// Connect with PostgreSQL DB
require("./config/postgres_config");

// Start gRPC config
require("./config/grpc_config");


// Import api routes
const itemsApi = require("./routes/items"); 


// Configure express server
const app = express();

// Apply global middleware
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());


// Apply REST API routes
app.use("/api/items", itemsApi);

// Generic error handler middleware
app.use(genericErrorHandler);

// Return 404 response if no route matched
app.use("*", (req, res) => void res.sendStatus(404).end());

// Initialize server
const http = require("http").Server(app);

// Start API server
http.listen(process.env.ITEMS_SERVICE_API_PORT, () => console.log(`Items Service REST API server listening on port ${process.env.ITEMS_SERVICE_API_PORT}`));
