const { postgresClient } = require("../config/postgres_config");
const HttpStatus = require("http-status-codes");


const addUser = async (email, safePasswordHash, firstName, lastName, role) => {
  try {
    // Create new user entry
    return await postgresClient.query("INSERT INTO UserService.Users (Email, Password, FirstName, LastName, Role) VALUES ($1, $2, $3, $4, $5);", [email, safePasswordHash, firstName, lastName, role]);
  }
  catch (error) {
    // Check if email unique constraint was violated
    if (error.constraint === "users_email_key") {
      throw new ApiError("A user with this email address already exists.", HttpStatus.CONFLICT);
    }

    throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

const getUserByEmail = async (email) => {
  try {
    // Get user by email address
    return await postgresClient.query("SELECT * FROM UserService.Users WHERE Email = $1;", [email]);
  }
  catch (error) {
    throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

const getUserById = async (userId) => {
  try {
    // Get user by user id
    return await postgresClient.query("SELECT Id, Email, FirstName, LastName, Role, CreationDate FROM UserService.Users WHERE Id = $1;", [userId]);
  }
  catch (error) {
    throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

const modifyUserById = async (userId, email, firstName, lastName) => {
  try {
    return await postgresClient.query("UPDATE UserService.Users SET Email = $1, FirstName = $2, LastName = $3 WHERE Id = $4 RETURNING *;", [email, firstName, lastName, userId])
  }
  catch (error) {
    // Check if email unique constraint was violated
    if (error.constraint === "users_email_key") {
      throw new ApiError("A user with this email address already exists.", HttpStatus.CONFLICT);
    }

    throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

const deleteUserById = async (userId) => {
  try {
    return await postgresClient.query("DELETE FROM UserService.Users WHERE Id = $1 RETURNING *;", [userId]);
  }
  catch (error) {
    throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}


module.exports = {
  addUser,
  getUserByEmail,
  getUserById,
  modifyUserById,
  deleteUserById
};