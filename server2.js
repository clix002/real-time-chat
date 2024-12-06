import express from "express";
import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { useServer } from "graphql-ws/lib/use/ws";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";

import { typeDefs } from "./typeDefs.js";
import { resolvers } from "./resolvers.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const context = ({ req }) => {
  let token = null;
  if (req.headers.authorization) {
    try {
      token = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }
  return { token };
};
const schema = makeExecutableSchema({ typeDefs, resolvers });

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

// Save the returned server's info so we can shut down this server later
const serverCleanup = useServer({ schema }, wsServer);

// create apollo server
const apolloServer = new ApolloServer({
  schema,
  context,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await apolloServer.start();
apolloServer.applyMiddleware({ app });

httpServer.listen(4000, () => {
  console.log(
    `
    🚀 Apollo and subscription server is running
    `
  );
});
