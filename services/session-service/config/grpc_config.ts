import grpc from "grpc";
import protoLoader from "@grpc/proto-loader";
import path from "path";

// Types
import { Server } from "grpc";
import { PackageDefinition } from "@grpc/proto-loader";

// Import gRPC method implementations
import { validateSession, createSession, replaceSession, removeSession } from "../grpc/session";


// Get path to proto file
const PROTO_PATH: string = path.join(__dirname, "../../../protos/session.proto");

const startServer = async (): Promise<void> => {
  // Load proto file
  const sessionPackageDefinition: PackageDefinition = protoLoader.loadSync(PROTO_PATH, { keepCase: true });

  // Get proto package definition
  // @ts-ignore gRPC proto file is dynamically imported, definition is not generated till runtime
  const loadedSessionGrpcPackage = grpc.loadPackageDefinition(sessionPackageDefinition).session;

  // Start gRPC server
  const server: Server = new Server();

  // Configure auth service grpc methods
  // @ts-ignore
  server.addService(loadedSessionGrpcPackage.SessionService.service, { validateSession, createSession, replaceSession, removeSession });

  // Bind gRPC server to url
  await server.bindAsync(
    process.env.SESSION_SERVICE_GRPC_BIND_URL,
    grpc.ServerCredentials.createInsecure(),
    (error: Error, port: number) => error ? console.log(error) : console.log(`Session gRPC Server listening on port: ${ port }`)
  );

  // Start gRPC server
  server.start();
}


// Call start server function
startServer();