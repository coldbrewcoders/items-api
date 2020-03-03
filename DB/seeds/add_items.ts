import Knex from "knex";
import faker from "faker";

const createFakeItem = (userId: number) => ({
  name: faker.commerce.productName(),
  description: faker.commerce.product(),
  created_by_user_id: userId,
  last_modified_by_user_id: userId
});

const seed = async (knex: Knex): Promise<void> => {

  const userId: number = 1;

  // Check if there is a user in the database
  const users = await knex("user_service.users").where("id", userId);

  // If there are no users in the DB, then add one so that items entry can reference a user id
  if (users.length !== 1) {
    // Add users to Users table
    await knex("user_service.users").insert({
      email: faker.internet.email(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      password: faker.internet.password()
    });
  }

  // Create fake items
  const fakeItems = [];
  const fakeItemsCount = 1000;

  for (let i = 0; i < fakeItemsCount; i++) {
    fakeItems.push(createFakeItem(userId));
  }

  // Add items to items table
  await knex("items_service.items").insert(fakeItems);

}

export { seed };