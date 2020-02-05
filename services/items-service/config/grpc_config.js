const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const grpcPromise = require("grpc-promise");

// Get path to proto file
const path = require("path");
const PROTO_PATH = path.join(__dirname, "../../../protos/session.proto");

// Load proto file
const protoFile = protoLoader.loadSync(PROTO_PATH, { keepCase: true });

// Get proto package definition
const sessionPackage = grpc.loadPackageDefinition(protoFile).session;

// Create client to make gRPC calls to auth server
const sessionServiceGrpcClient = new sessionPackage.SessionService(process.env.SESSION_SERVICE_GRPC_URL, grpc.credentials.createInsecure());

// Promisify gRPC client
grpcPromise.promisifyAll(sessionServiceGrpcClient);


module.exports = {
  sessionServiceGrpcClient
};