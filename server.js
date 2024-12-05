import { ApolloServer } from "apollo-server";
import jwt from "jsonwebtoken";

import { typeDefs } from "./typeDefs.js";
import { resolvers } from "./resolvers.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization
      ? jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
      : null;
    return { token };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server is running at ${url} `);
});
