import Knex from "knex";
import faker from "faker";

// Types
import { IUser } from "./1_add_users";


export interface IItem {
  id?: number;
  name: string;
  description: string;
  created_by_user_id: number;
  last_modified_by_user_id: number;
}

const getRandomNumberInRange = (min: number, max: number): number => Math.floor(Math.random() * ((max + 1) - min)) + min;

export const seed = async (knex: Knex): Promise<void> => {

  console.log("Seeding items...")

  const user: IUser = await knex<IUser>("user_service.users").first();

  if (!user) {
    console.error("Must seed users before seeding items");
    process.exit(1);
  }

  // Find min and max user id
  const [ { min: minUserId } ] = await knex("user_service.users").min("id");
  const [ { max: maxUserId } ] = await knex("user_service.users").max("id");

  // Create fake items
  const fakeItems: Array<IItem> = [];
  const fakeItemsCount: number = 1000;

  for (let i = 0; i < fakeItemsCount; i++) {
    fakeItems.push({
      name: `${faker.commerce.product()} v${i}`, // Add version suffix for uniqueness (constraint)
      description: faker.commerce.productName(),
      created_by_user_id: getRandomNumberInRange(minUserId, maxUserId),
      last_modified_by_user_id: getRandomNumberInRange(minUserId, maxUserId)
    });
  }

  // Add items to items table
  await knex("items_service.items").insert(fakeItems);
}