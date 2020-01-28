const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

// Get path to proto file
const path = require("path");
const PROTO_PATH = path.join(__dirname, "../../../protos/auth.proto");

// Load proto file
const protoFile = protoLoader.loadSync(PROTO_PATH, { keepCase: true });

// Get proto package definition
const auth_proto = grpc.loadPackageDefinition(protoFile).auth;

// Create client to make gRPC calls to auth server
const authServiceGrpcClient = new auth_proto.AuthService(process.env.AUTH_SERVICE_GRPC_URL, grpc.credentials.createInsecure());


module.exports = {
  authServiceGrpcClient
};