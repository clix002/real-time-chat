import { ApolloServer } from "apollo-server";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { typeDefs } from "./typeDefs.js";
import { resolvers } from "./resolvers.js";

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    let token = null;
    if (req.headers.authorization) {
      try {
        token = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
    return { token };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server is running at ${url} `);
});
