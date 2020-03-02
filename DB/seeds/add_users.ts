import Knex from "knex";
import faker from "faker";

const createFakeUser = () => ({
  email: faker.internet.email(),
  firstname: faker.name.firstName(),
  lastname: faker.name.lastName(),
  password: faker.internet.password()
  // TODO: Hard code password as a common password hash
});

const seed = async (knex: Knex): Promise<any> => {

  // Create fake users
  const fakeUsers = [];
  const fakeUsersCount = 1000;
  for (let i = 0; i < fakeUsersCount; i++) {
    fakeUsers.push(createFakeUser());
  }

  // Add users to Users table
  await knex("userservice.users").insert(fakeUsers);
  // TODO: Camel case does not work..

}

export { seed };