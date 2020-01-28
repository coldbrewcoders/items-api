const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

// Read JWT private and public keys
const privateKey = fs.readFileSync(path.join(__dirname, "../keys/private.key"), "utf8");
const publicKey = fs.readFileSync(path.join(__dirname, "../keys/public.key"), "utf8");


/*** Private module methods ***/

const _getSignOptions = (userId, email) => ({
  issuer: "session-service",
  subject: email,
  audience: userId,
  expiresIn: "30m",
  algorithm: "RS256"
});

const _getVerifyOptions = (userId, email) => ({
  issuer: "session-service",
  subject: email,
  audience: userId,
  expiresIn: "30m",
  algorithm: ["RS256"]
});


/*** Public module methods ***/

const signJwt = (userId, email, firstName, lastName, role) => {

  // Define session data present in token
  const payload = {
    userId,
    email,
    firstName,
    lastName,
    role
  };

  try {
    // Create signed JWT for user session token
    return jwt.sign(payload, privateKey, _getSignOptions(userId, email));
  }
  catch (error) {
    console.error(`JWT SIGNATURE ERROR: ${error}`);
    return false;
  }
}

const verifyJwt = (token, userId, email) => {
  try {
    // Return verified token payload
    return jwt.verify(token, publicKey, _getVerifyOptions(userId, email));
  }
  catch (error) {
    console.error(`JWT VERIFICATION ERROR: ${error}`);
    return false;
  }
}

const decodeJwtWithoutVerification = (token) => {
  try {
    // Return decoded token payload without verification
    return jwt.decode(token);
  }
  catch (error) {
    console.error(`JWT DECODE ERROR: ${error}`);
    return false;
  }
}


module.exports = {
  signJwt,
  verifyJwt,
  decodeJwtWithoutVerification
};