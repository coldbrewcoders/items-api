// Repository
const { signJwt, verifyJwt } = require("../repository/jwt");
const { getSessionToken, setSessionToken, removeSessionToken } = require("../repository/session_manager");


const validateSession = async (call, callback) => {
  const { userId, sessionToken } = call.request;
  
  callback(null, { hasValidSession: true, userRole: "ADMIN" });
}

const createSession = async (call, callback) => {
  const { userId, email, firstName, lastName, role } = call.request;

  // Create new signed JWT session token
  const sessionToken = signJwt(userId, email, firstName, lastName, role);

  // Check if token creation was successful
  if (!sessionToken) {

    // Failed to create toke, return error
    callback("Error creation JWT", { sessionToken: null });

  }
  else {

    // Add session token to redis
    const result = await setSessionToken(userId, sessionToken);

    // return new JWT
    callback(null, { sessionToken });
  }
}

const removeSession = async (call, callback) => {
  const { userId } = call.request;

  callback(null, { isRemoved: true });
}


module.exports = {
  validateSession,
  createSession,
  removeSession
};