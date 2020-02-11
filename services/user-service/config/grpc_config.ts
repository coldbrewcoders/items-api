import grpc from "grpc";
import protoLoader from "@grpc/proto-loader";
import grpcPromise from "grpc-promise";
import path from "path";

// Types
import { GrpcObject, Client } from "grpc";
import { PackageDefinition } from "@grpc/proto-loader";


// Get path to proto file
const PROTO_PATH: string = path.join(__dirname, "../../../protos/session.proto");

// Load proto file
const sessionPackageDefinition: PackageDefinition = protoLoader.loadSync(PROTO_PATH, { keepCase: true });

// Get proto package definition
const sessionGrpcObject: GrpcObject = grpc.loadPackageDefinition(sessionPackageDefinition).session;

// Create client to make gRPC calls to auth server
const sessionServiceGrpcClient: Client = new sessionGrpcObject.SessionService(process.env.SESSION_SERVICE_GRPC_URL, grpc.credentials.createInsecure());

// Promisify gRPC client
grpcPromise.promisifyAll(sessionServiceGrpcClient);

export { sessionServiceGrpcClient };