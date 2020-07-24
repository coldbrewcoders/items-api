// Repository
import { getUserById as getUserByIdQuery } from "../repository/queries";

// Types
import { QueryResult } from "pg";


const getUserById = async (call: any, callback: Function): Promise<void> => {
  try {
    const userId: number = call.request?.userId;

    // Get user info from id
    const result: QueryResult<any> = await getUserByIdQuery(String(userId));

    // Check if we were able to find a user
    if (result.rowCount !== 1) {
      callback("No user found for this id", null);
    }

    // Get user info from query result
    const { email, first_name: firstName, last_name: lastName, role } = result.rows[0];

    // Return user info to caller
    callback(null, { userId, email, firstName, lastName, role });
  }
  catch (error) {
    // Return error to caller
    callback("Error getting user info", null);
  }
}

export { getUserById };