import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

// Utils
import logger from "../../utils/Logger";

// Types
import { Secret, VerifyOptions, SignOptions } from "jsonwebtoken";


// Read JWT private and public keys
const privateKey: Secret = fs.readFileSync(path.join(__dirname, "../keys/private.key"), "utf8");
const publicKey: Secret = fs.readFileSync(path.join(__dirname, "../keys/public.key"), "utf8");

const signOptions: SignOptions = {
  issuer: "session-service",
  subject: "items-api",
  audience: "user",
  algorithm: "RS256"
};

const verifyOptions: VerifyOptions = {
  issuer: "session-service",
  subject: "items-api",
  audience: "user",
  algorithms: ["RS256"]
};


const signJwt = (userId: number, email: string, firstName: string, lastName: string, role: string): string => {

  // Define session data present in token
  const payload: ISessionValues = {
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
    logger.error(`JWT SIGNATURE ERROR: ${error}`);
  }
}

const verifyJwt = (token: string): ISessionValues => {
  try {
    // Return verified token payload
    return jwt.verify(token, publicKey, verifyOptions) as ISessionValues;
  }
  catch (error) {
    logger.error(`JWT VERIFICATION ERROR: ${error}`);
  }
}

const decodeJwtWithoutVerification = (token: string): ISessionValues => {
  try {
    // Return decoded token payload without verification
    return jwt.decode(token) as ISessionValues;
  }
  catch (error) {
    logger.error(`JWT DECODE ERROR: ${error}`);
  }
}

export { signJwt, verifyJwt, decodeJwtWithoutVerification };