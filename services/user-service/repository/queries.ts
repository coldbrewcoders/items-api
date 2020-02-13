import { postgresClient } from "../config/postgres_config";
import HttpStatus from "http-status-codes";

// Utils
import ApiError from "../../utils/ApiError";

// Types
import { QueryResult } from "pg";


const addUser = async (email: string, safePasswordHash: string, firstName: string, lastName: string, role: string): Promise<QueryResult<any>> => {
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

const getUserByEmail = async (email: string): Promise<QueryResult<any>> => {
  try {
    // Get user by email address
    return await postgresClient.query("SELECT * FROM UserService.Users WHERE Email = $1;", [email]);
  }
  catch (error) {
    throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

const getUserById = async (userId: string): Promise<QueryResult<any>> => {
  try {
    // Get user by user id
    return await postgresClient.query("SELECT Id, Email, FirstName, LastName, Role, CreationDate FROM UserService.Users WHERE Id = $1;", [userId]);
  }
  catch (error) {
    throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

const modifyUserById = async (userId: string, email: string, firstName: string, lastName: string): Promise<QueryResult<any>> => {
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

const deleteUserById = async (userId: string): Promise<QueryResult<any>> => {
  try {
    return await postgresClient.query("DELETE FROM UserService.Users WHERE Id = $1 RETURNING *;", [userId]);
  }
  catch (error) {
    throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export {
  addUser,
  getUserByEmail,
  getUserById,
  modifyUserById,
  deleteUserById
};