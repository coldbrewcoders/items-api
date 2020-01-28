CREATE SCHEMA UserService;

CREATE TYPE UserService.UserRoles AS ENUM ('BASIC', 'ADMIN');

CREATE TABLE UserService.Users (
	Id SERIAL PRIMARY KEY,
	Email VARCHAR(100) NOT NULL UNIQUE,
	Password VARCHAR(100) NOT NULL,
	FirstName VARCHAR(100) NOT NULL,
	LastName VARCHAR(100) NOT NULL,
  Role UserService.UserRoles NOT NULL DEFAULT 'BASIC',
	CreationDate TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),

	CONSTRAINT check_email CHECK(LENGTH(Email) > 0),
	CONSTRAINT check_password CHECK(LENGTH(Password) > 0),
	CONSTRAINT check_first_name CHECK(LENGTH(FirstName) > 0),
	CONSTRAINT check_last_name CHECK(LENGTH(LastName) > 0)
);


CREATE SCHEMA ItemsService;

CREATE TABLE ItemsService.Items (
  Id SERIAL PRIMARY KEY,
  Name VARCHAR(100) NOT NULL UNIQUE,
  Description VARCHAR NOT NULL,
	CreatedByUserId INT NOT NULL REFERENCES UserService.Users(Id) ON DELETE CASCADE,
	LastModifiedByUserId INT REFERENCES UserService.Users(Id) ON DELETE SET NULL,

  CONSTRAINT check_name CHECK(LENGTH(Name) > 0),
	CONSTRAINT check_description CHECK(LENGTH(Description) > 0)
);