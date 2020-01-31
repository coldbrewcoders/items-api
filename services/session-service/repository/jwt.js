const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

// Read JWT private and public keys
const privateKey = fs.readFileSync(path.join(__dirname, "../keys/private.key"), "utf8");
const publicKey = fs.readFileSync(path.join(__dirname, "../keys/public.key"), "utf8");


const signOptions = {
  issuer: "session-service",
  subject: "items-api",
  audience: "user",
  algorithm: "RS256"
};

const verifyOptions = {
  issuer: "session-service",
  subject: "items-api",
  audience: "user",
  algorithm: ["RS256"]
};


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
    return jwt.sign(payload, privateKey, signOptions);
  }
  catch (error) {
    console.error(`JWT SIGNATURE ERROR: ${error}`);
    return false;
  }
}

const verifyJwt = (token) => {
  try {
    // Return verified token payload
    return jwt.verify(token, publicKey, verifyOptions);
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