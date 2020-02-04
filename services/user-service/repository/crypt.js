const bcrypt = require("bcrypt");
const HttpStatus = require("http-status-codes");


const SALT_ROUNDS = 10;

const generatePasswordHash = async (password) => {
  try {
    // Generate hashed password safe for storage
    return await bcrypt.hash(password, SALT_ROUNDS);
  }
  catch (error) {
    throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

const verifyPassword = async (submittedPassword, passwordHash) => {
  try {
    // Verify that submitted password is correct
    return await bcrypt.compare(submittedPassword, passwordHash);
  }
  catch (error) {
    throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}


module.exports = {
  generatePasswordHash,
  verifyPassword
};