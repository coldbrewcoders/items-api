import Knex from "knex";
import faker from "faker";

export interface IUser {
  id?: number;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export const createUser = (): IUser => ({
  email: faker.internet.email(),
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  password: faker.internet.password()
});

export const seed = async (knex: Knex): Promise<void> => {

  // Create fake users
  const fakeUsers: Array<IUser> = [];
  const fakeUsersCount: number = 100;

  for (let i = 0; i < fakeUsersCount; i++) {
    fakeUsers.push(createUser());
  }

  // Add users to Users table
  await knex("user_service.users").insert(fakeUsers);

}