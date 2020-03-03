import Knex from "knex";
import faker from "faker";

// Types & helpers
import { IUser, createUser } from "./add_users";

export interface IItem {
  id?: number;
  name: string;
  description: string;
  created_by_user_id: number;
  last_modified_by_user_id: number;
}

export const seed = async (knex: Knex): Promise<void> => {

  // Select first user to ensure one exists to satisfy items table foreign key constraint
  const userId: number = 1;
  const user: IUser = await knex<IUser>("user_service.users").where("id", userId).first();

  // If there are no users in the DB, then add one so that items entry can reference a user id
  if (!user) await knex("user_service.users").insert(createUser());

  // Create fake items
  const fakeItems: Array<IItem> = [];
  const fakeItemsCount: number = 100;

  for (let i = 0; i < fakeItemsCount; i++) {
    fakeItems.push({
      name: `${faker.commerce.productName()} v${i}`, // Add version suffix for uniqueness (constraint)
      description: faker.commerce.product(),
      created_by_user_id: userId,
      last_modified_by_user_id: userId
    });
  }

  // Add items to items table
  await knex("items_service.items").insert(fakeItems);

}