import grpc from "grpc";
import { loadSync } from "@grpc/proto-loader";
import path from "path";

// Config
import logger from "./logger_config";

// Types
import { Server } from "grpc";
import { PackageDefinition } from "@grpc/proto-loader";


// Import gRPC method implementations
import { validateSession, createSession, replaceSession, removeSession } from "../grpc/session";


// Get path to proto file
const PROTO_PATH: string = path.join(__dirname, "../../../protos/session.proto");

// Load proto file
const sessionPackageDefinition: PackageDefinition = loadSync(PROTO_PATH, { keepCase: true });

// Get proto package definition
// @ts-ignore gRPC proto file is dynamically imported, definition is not generated till runtime
const loadedSessionGrpcPackage = grpc.loadPackageDefinition(sessionPackageDefinition).session;

// Start gRPC server
const server: Server = new Server();

// Configure auth service grpc methods
// @ts-ignore
server.addService(loadedSessionGrpcPackage.SessionService.service, { validateSession, createSession, replaceSession, removeSession });

// Bind gRPC server to url
server.bind(process.env.SESSION_SERVICE_GRPC_BIND_URL, grpc.ServerCredentials.createInsecure());

// Start gRPC server
server.start();

logger.info(`Session gRPC server listening on port: ${process.env.SESSION_SERVICE_GRPC_BIND_URL}.`);