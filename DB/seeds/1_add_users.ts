import Knex from "knex";
import faker from "faker";

export interface IUser {
  id?: number;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  role: string;
}

// Encrypted, storage-safe string for 'password'
const encryptedPassword = "$2b$10$TaLH39x8mMOTfiYgGzv6HOKEfCLsbytzVk3BqGWmmSP3/jZ4NGIDC";

export const createUser = (): IUser => ({
  email: faker.internet.email(),
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  password: encryptedPassword,
  role: (Math.random() >= 0.8) ? "ADMIN" : "BASIC"
});

export const seed = async (knex: Knex): Promise<void> => {

  console.log("Seeding users...")

  // Create fake users
  const fakeUsers: Array<IUser> = [];
  const fakeUsersCount: number = 100;

  for (let i = 0; i < fakeUsersCount; i++) {
    fakeUsers.push(createUser());
  }

  // Add users to Users table
  await knex("user_service.users").insert(fakeUsers);
}