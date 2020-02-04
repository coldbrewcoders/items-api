const { postgresClient } = require("../config/postgres_config");

const getAllItems = async () => {
  try {
    // Get all items
    return await postgresClient.query("SELECT * FROM ItemsService.Items");
  }
  catch (error) {
    console.error(`Items Service: getAllItems ERROR -> ${error}`);
    return error;
  }
}