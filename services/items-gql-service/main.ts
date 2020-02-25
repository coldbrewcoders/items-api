import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import express from "express";
import compression from "compression";
import morgan from "morgan";
import graphqlHTTP from "express-graphql";
import { buildSchema } from "graphql";

// Utils
import notFoundHandler from "../utils/notFoundHandler";
import GenericErrorHandlerFactory from "../utils/GenericErrorHandlerFactory";

// Types
import { Application } from "express";
import { Server } from "http";
import { GraphQLSchema } from "graphql";

// Init logger for service
import logger from "./config/logger_config";


// Configure express server
const app: Application = express();

// Apply global middleware
app.use(morgan("combined"));
app.use(compression());

const schema: GraphQLSchema = buildSchema(`
  type Query {
    hello: String
  }
`);

app.use("/graphql", graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

// Return 404 response if no route matched
app.use("*", notFoundHandler);

// Generic error handler middleware
app.use(GenericErrorHandlerFactory(logger));

// Initialize REST API server
const server: Server = createServer(app);

// Set port
const port = process.env.ITEMS_GQL_SERVICE_API_PORT || 4000;

server.listen(port, () => logger.info(`GraphQL API server listening on port ${port}.`));