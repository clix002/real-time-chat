import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    users: [User]
    user(id: ID): User
  }

  input UserInput {
    firstName: String
    lastName: String
    email: String
    password: String
  }

  input UserSignin {
    firstName: String
    lastName: String
    email: String
    password: String
  }

  type Token {
    token: String!
  }

  type Mutation {
    signupUser(userNew: UserInput): User
    signinUser(userSignin: UserSignin): Token
  }

  type User {
    id: ID
    firstName: String
    lastName: String
    email: String
  }
`;
