// Repository
import { getUserById as getUserByIdQuery } from "../repository/queries";


interface IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

const getUserById = async (call: any, callback: Function): Promise<void> => {
  try {
    const userId: number = call.request?.userId;

    // Get user info from id
    const user: IUser = await getUserByIdQuery(userId);

    const { email, first_name: firstName, last_name: lastName, role } = user;

    // Return user info to caller
    callback(null, { userId, email, firstName, lastName, role });
  }
  catch (error) {
    // Return error to caller
    callback("Error getting user info", { userId: null, email: null, firstName: null, lastName: null, role: null });
  }
}

export { getUserById };