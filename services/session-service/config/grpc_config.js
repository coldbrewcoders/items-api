const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

// Get path to proto file
const path = require("path");
const PROTO_PATH = path.join(__dirname, "../../../protos/session.proto");

// Load proto file
const protoFile = protoLoader.loadSync(PROTO_PATH, { keepCase: true });

// Get proto package definition
const sessionPackage = grpc.loadPackageDefinition(protoFile).session;

// Start gRPC server
const server = new grpc.Server();

// Import gRPC method implementations
const { validateSession, createSession, replaceSession, removeSession } = require("../grpc/session");

// Configure auth service grpc methods
server.addService(sessionPackage.SessionService.service, { validateSession, createSession, replaceSession, removeSession });

// Bind gRPC server to url
server.bind(process.env.SESSION_SERVICE_GRPC_BIND_URL, grpc.ServerCredentials.createInsecure());

// Start gRPC server
server.start();