import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import compression from "compression";

// Utils
import notFoundHandler from "../utils/notFoundHandler";
import genericErrorHandler from "../utils/genericErrorHandler";

// Init connection to postgreSQL DB
import "./config/postgres_config";

// Start gRPC server
import "./config/grpc_config";


// Import REST API routes
// import signupApi from "./routes/signup";
// import loginApi from "./routes/login";
// import logoutApi from "./routes/logout";
// import userAPI from "./routes/user";

// Configure express server
const app = express();

// Apply global middleware
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());

// Configure REST API routes
// app.use("/api/signup", signupApi);
// app.use("/api/login", loginApi);
// app.use("/api/logout", logoutApi);
// app.use("/api/user", userAPI);

// Return 404 response if no route matched
app.use("*", notFoundHandler);

// Generic error handler middleware
app.use(genericErrorHandler);

// Initialize REST API server
const server = createServer(app);

// Start API server
server.listen(process.env.USER_SERVICE_API_PORT, () => console.log(`User Service REST API server listening on port ${process.env.USER_SERVICE_API_PORT}`));