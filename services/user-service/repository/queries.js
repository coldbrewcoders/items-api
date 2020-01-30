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
    return await postgresClient.query("SELECT * FROM UserService.Users WHERE Email = $1;", [email]);
  }
  catch (error) {
    console.error(`User Service: getUserByEmail ERROR -> ${error}`);
    return error;
  }
}

const getUserById = async (userId) => {
  try {
    // Get user by user id
    return await postgresClient.query("SELECT Id, Email, FirstName, LastName, Role, CreationDate FROM UserService.Users WHERE Id = $1;", [userId]);
  }
  catch (error) {
    console.error(`User Service: getUserById ERROR -> ${error}`);
    return error;
  }
}

const modifyUserById = async (userId, email, firstName, lastName) => {
  try {
    return await postgresClient.query("UPDATE UserService.Users SET Email = $1, FirstName = $2, LastName = $3 WHERE Id = $4 RETURNING *;", [email, firstName, lastName, userId])
  }
  catch (error) {
    console.error(`User Service: modifyUserById ERROR -> ${error}`);
    return error;
  }
}

const deleteUserById = async (userId) => {
  try {
    return await postgresClient.query("DELETE FROM UserService.Users WHERE Id = $1 RETURNING *;", [userId]);
  }
  catch (error) {
    console.error(`User Service: deleteUserById ERROR -> ${error}`);
    return error;
  }
}


module.exports = {
  addUser,
  getUserByEmail,
  getUserById,
  modifyUserById,
  deleteUserById
};