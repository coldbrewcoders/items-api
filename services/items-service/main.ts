import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import compression from "compression";

// Utils
import notFoundHandler from "../utils/notFoundHandler";
import GenericErrorHandlerFactory from "../utils/GenericErrorHandlerFactory";

// Types
import { Application } from "express";
import { Server } from "http";

// Init logger for service
import logger from "./config/logger_config";

// Init connection to postgreSQL DB
import "./config/postgres_config";

// Start gRPC config
import "./config/grpc_config";


// Import api routes
import itemsApi from "./routes/items";

// Configure express server
const app: Application = express();

// Apply global middleware
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());

// Configure REST API routes
app.use("/api/items", itemsApi);

// Return 404 response if no route matched
app.use("*", notFoundHandler);

// Generic error handler middleware
app.use(GenericErrorHandlerFactory(logger));

// Initialize REST API server
const server: Server = createServer(app);

// Start API server
server.listen(process.env.ITEMS_SERVICE_API_PORT, () => logger.info(`REST API server listening on port ${process.env.ITEMS_SERVICE_API_PORT}`));