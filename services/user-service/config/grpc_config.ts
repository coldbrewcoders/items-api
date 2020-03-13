import grpc from "grpc";
import { loadSync } from "@grpc/proto-loader";
import grpcPromise from "grpc-promise";
import path from "path";

// Config
import logger from "./logger_config";

// Types
import { Server } from "grpc";
import { PackageDefinition } from "@grpc/proto-loader";

/** Start gRPC Server **/

// Import gRPC method implementations
import { getUserById } from "../grpc/user";

// Get path to user proto file
const USER_PROTO_PATH: string = path.join(__dirname, "../../../protos/user.proto");

// Load user proto file
const userPackageDefinition: PackageDefinition = loadSync(USER_PROTO_PATH, { keepCase: true });

// Get proto package definition
// @ts-ignore gRPC proto file is dynamically imported, definition is not generated till runtime
const loadedUserGrpcPackage = grpc.loadPackageDefinition(userPackageDefinition).user;

// Start gRPC server
const server: Server = new Server();

// Configure user service grpc methods
// @ts-ignore
server.addService(loadedUserGrpcPackage.UserService.service, { getUserById });

// Bind gRPC server to url
server.bind(process.env.USER_SERVICE_GRPC_BIND_URL, grpc.ServerCredentials.createInsecure());

// Start gRPC server
server.start();

logger.info(`gRPC server listening on: ${process.env.USER_SERVICE_GRPC_BIND_URL}.`);


/** Get gRPC client for session service **/

// Get path to proto file
const SESSION_PROTO_PATH: string = path.join(__dirname, "../../../protos/session.proto");

// Get session proto file
const sessionPackageDefinition: PackageDefinition = loadSync(SESSION_PROTO_PATH, { keepCase: true });

// Load session package and get gRPC client to session service
// @ts-ignore gRPC proto file is dynamically imported, definition is not generated till runtime
const loadedSessionGrpcPackage = grpc.loadPackageDefinition(sessionPackageDefinition).session
// @ts-ignore
const sessionServiceGrpcClient = new loadedSessionGrpcPackage.SessionService(process.env.SESSION_SERVICE_GRPC_URL, grpc.credentials.createInsecure());

// Promisify gRPC client
grpcPromise.promisifyAll(sessionServiceGrpcClient);

export { sessionServiceGrpcClient };