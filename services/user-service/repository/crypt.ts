import bcrypt from "bcrypt";
import HttpStatus from "http-status-codes";

// Utils
import ApiError from "../../utils/ApiError";


const SALT_ROUNDS = 10;

const generatePasswordHash = async (password: string): Promise<string> => {
  try {
    // Generate hashed password safe for storage
    return await bcrypt.hash(password, SALT_ROUNDS);
  }
  catch (error) {
    throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

const verifyPassword = async (submittedPassword: string, passwordHash: string): Promise<boolean> => {
  try {
    // Verify that submitted password is correct
    return await bcrypt.compare(submittedPassword, passwordHash);
  }
  catch (error) {
    throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}


export { generatePasswordHash, verifyPassword };