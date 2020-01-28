const bcrypt = require("bcrypt");


const SALT_ROUNDS = 10;


const generatePasswordHash = async (password) => {
  try {
    // Generate hashed password safe for storage
    return await bcrypt.hash(password, SALT_ROUNDS);
  }
  catch (error) {
    console.error(`User Service: generatePasswordHash ERROR -> ${error}`);
    return false;
  }
}

const verifyPassword = async (submittedPassword, passwordHash) => {
  try {
    // Verify that submitted password is correct
    return await bcrypt.compare(submittedPassword, passwordHash);
  }
  catch (error) {
    console.error(`User Service: verifyPassword ERROR -> ${error}`);
    return false;
  }
}


module.exports = {
  generatePasswordHash,
  verifyPassword
};