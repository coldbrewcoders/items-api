import grpc from "grpc";
import { loadSync } from "@grpc/proto-loader";
import grpcPromise from "grpc-promise";
import path from "path";

// Types
import { PackageDefinition } from "@grpc/proto-loader";


// Get path to proto file
const PROTO_PATH: string = path.join(__dirname, "../../../protos/session.proto");

// Get session proto file
const sessionPackageDefinition: PackageDefinition = loadSync(PROTO_PATH, { keepCase: true });

// Load session package and get gRPC client to session service
// @ts-ignore gRPC proto file is dynamically imported, definition is not generated till runtime
const loadedSessionGrpcPackage = grpc.loadPackageDefinition(sessionPackageDefinition).session
// @ts-ignore
const sessionServiceGrpcClient = new loadedSessionGrpcPackage.SessionService(process.env.SESSION_SERVICE_GRPC_URL, grpc.credentials.createInsecure());

// Promisify gRPC client
grpcPromise.promisifyAll(sessionServiceGrpcClient);

export { sessionServiceGrpcClient };