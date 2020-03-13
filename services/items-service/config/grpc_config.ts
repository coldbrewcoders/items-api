import grpc from "grpc";
import { loadSync } from "@grpc/proto-loader";
import grpcPromise from "grpc-promise";
import path from "path";

// Types
import { PackageDefinition } from "@grpc/proto-loader";


// Get path to proto files
const SESSION_PROTO_PATH: string = path.join(__dirname, "../../../protos/session.proto");
const USER_PROTO_PATH: string = path.join(__dirname, "../../../protos/user.proto");

// Get session and user proto files
const sessionPackageDefinition: PackageDefinition = loadSync(SESSION_PROTO_PATH, { keepCase: true });
const userPackageDefinition: PackageDefinition = loadSync(USER_PROTO_PATH, { keepCase: true });

// Load session package and get gRPC client to session service
// @ts-ignore gRPC proto file is dynamically imported, definition is not generated till runtime
const loadedSessionGrpcPackage = grpc.loadPackageDefinition(sessionPackageDefinition).session;
// @ts-ignore
const sessionServiceGrpcClient = new loadedSessionGrpcPackage.SessionService(process.env.SESSION_SERVICE_GRPC_URL, grpc.credentials.createInsecure());

// Load user package and get gRPC client to user service
// @ts-ignore gRPC proto file is dynamically imported, definition is not generated till runtime
const loadedUserGrpcPackage = grpc.loadPackageDefinition(userPackageDefinition).user;
// @ts-ignore
const userServiceGrpcClient = new loadedUserGrpcPackage.UserService(process.env.USER_SERVICE_GRPC_URL, grpc.credentials.createInsecure());

// Promisify gRPC clients
grpcPromise.promisifyAll(sessionServiceGrpcClient);
grpcPromise.promisifyAll(userServiceGrpcClient);

export { sessionServiceGrpcClient, userServiceGrpcClient };