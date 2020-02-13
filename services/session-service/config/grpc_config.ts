import grpc from "grpc";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { promisify } from "bluebird";

// Types
import { Server } from "grpc";
import { PackageDefinition } from "@grpc/proto-loader";

// Utils
import logger from "../../utils/Logger";

// Import gRPC method implementations
import { validateSession, createSession, replaceSession, removeSession } from "../grpc/session";


// Get path to proto file
const PROTO_PATH: string = path.join(__dirname, "../../../protos/session.proto");

const startServer = async (): Promise<void> => {
  try {
    // Load proto file
    const sessionPackageDefinition: PackageDefinition = await protoLoader.load(PROTO_PATH, { keepCase: true });

    // Get proto package definition
    // @ts-ignore gRPC proto file is dynamically imported, definition is not generated till runtime
    const loadedSessionGrpcPackage = grpc.loadPackageDefinition(sessionPackageDefinition).session;

    // Start gRPC server
    const server: Server = new Server();

    // Promisify server binding async function
    const bindGrpcServer = promisify(server.bindAsync);

    // Configure auth service grpc methods
    // @ts-ignore
    server.addService(loadedSessionGrpcPackage.SessionService.service, { validateSession, createSession, replaceSession, removeSession });

    // Bind gRPC server to url
    const port = await bindGrpcServer(process.env.SESSION_SERVICE_GRPC_BIND_URL, grpc.ServerCredentials.createInsecure());

    // Start gRPC server
    server.start();

    logger.info(`Session gRPC server listening on port: ${port}.`);
  }
  catch (error) {
    logger.error(error);
  }

}

// Call start server function
startServer();