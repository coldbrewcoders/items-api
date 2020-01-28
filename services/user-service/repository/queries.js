const { postgresClient } = require("../config/postgres_config");


const addUser = async (email, safePasswordHash, firstName, lastName, role) => {
  try {
    // Create new user entry
    return await postgresClient.query("INSERT INTO UserService.Users (Email, Password, FirstName, LastName, Role) VALUES ($1, $2, $3, $4, $5);", [email, safePasswordHash, firstName, lastName, role]);
  }
  catch (error) {
    console.error(`User Service: addUser ERROR -> ${error}`);
    return error;
  }
}

const getUserByEmail = async (email) => {
  try {
    // Get user by email address
    return await postgresClient.query("SELECT * FROM UserService.Users WHERE EMAIL = $1;", [email]);
  }
  catch (error) {
    console.error(`User Service: getUserByEmail ERROR -> ${error}`);
    return error;
  }
}


module.exports = {
  addUser,
  getUserByEmail
};