import { postgresClient } from "../config/postgres_config";
import HttpStatus from "http-status-codes";

// Utils
import ApiError from "../../utils/ApiError";

// Types
import { QueryResult } from "pg";


const getAllItems = async (): Promise<QueryResult<any>> => {
  try {
    // Get all items
    return await postgresClient.query("SELECT * FROM ItemsService.Items;");
  }
  catch (error) {
    throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

const getItemsCreatedByUser = async (userId: string): Promise<QueryResult<any>> => {
  try {
    // Return all items created by a specific user
    return await postgresClient.query("SELECT * FROM ItemsService.Items WHERE CreatedByUserId = $1;", [userId]);
  }
  catch (error) {
    throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

const getItemsModifiedByUser = async (userId: string): Promise<QueryResult<any>> => {
  try {
    // Return all items last modified by a specific user
    return await postgresClient.query("SELECT * FROM ItemsService.Items WHERE LastModifiedByUserId = $1;", [userId]);
  }
  catch (error) {
    throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

const getItemById = async (itemId: string): Promise<QueryResult<any>> => {
  try {
    // Return a specific item by id
    return await postgresClient.query("SELECT * FROM ItemsService.Items WHERE Id = $1;", [itemId]);
  }
  catch (error) {
    throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

const createItem = async (name: string, description: string, userId: string): Promise<QueryResult<any>> => {
  try {
    // Create a new item entry
    return await postgresClient.query(
      "INSERT INTO ItemsService.Items (Name, Description, CreatedByUserId) VALUES ($1, $2, $3) RETURNING *;",
      [name, description, userId]
    );
  }
  catch (error) {
    // Check if item name unique constraint was violated
    if (error.constraint === "items_name_key") {
      throw new ApiError("An item with this name already exists.", HttpStatus.CONFLICT);
    }

    throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

const updateItemById = async (itemId: string, name: string, description: string, userId: string, role: string): Promise<QueryResult<any>> => {
  try {
    // Update existing item's name or description (user must be an admin or own this item)
    return await postgresClient.query(
      "UPDATE ItemsService.Items SET Name = $1, Description = $2, LastModifiedByUserId = $4 WHERE Id = $3 AND (CreatedByUserId = $4 OR $5 = 'ADMIN') RETURNING *;",
      [name, description, itemId, userId, role]
    );
  }
  catch (error) {
    // Check if item name unique constraint was violated
    if (error.constraint === "items_name_key") {
      throw new ApiError("An item with this name already exists.", HttpStatus.CONFLICT);
    }

    throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

const deleteItemById = async (itemId: string, userId: string, role: string): Promise<QueryResult<any>> => {
  try {
    // Delete item entry (user must be an admin or own this item)
    return await postgresClient.query(
      "DELETE FROM ItemsService.Items WHERE Id = $1 AND (CreatedByUserId = $2 OR $3 = 'ADMIN') RETURNING *;",
      [itemId, userId, role]
    );
  }
  catch (error) {
    throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}


export {
  getAllItems,
  getItemsCreatedByUser,
  getItemsModifiedByUser,
  getItemById,
  createItem,
  updateItemById,
  deleteItemById
};