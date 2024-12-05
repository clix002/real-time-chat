import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    users: [User]
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

  scalar Date

  type Message {
    id: ID!
    text: String!
    senderId: Int!
    receiverId: Int!
    createdAt: Date!
  }

  type Mutation {
    signupUser(userNew: UserInput): User
    signinUser(userSignin: UserSignin): Token
    createMessage(text: String, receiverId: Int): Message
  }

  type User {
    id: ID
    firstName: String!
    lastName: String!
    email: String!
  }
`;
