import { PrismaClient } from "@prisma/client";
import { AuthenticationError, ForbiddenError } from "apollo-server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    users: async (_, a_, { token }) => {
      console.log(token);
      if (!token) {
        throw new ForbiddenError("You are not authenticated ");
      }
      return await prisma.user.findMany({
        where: {
          id: {
            not: token.id,
          },
        },
        orderBy: {
          createedAt: "desc",
        },
      });
    },
  },
  Mutation: {
    signupUser: async (_, { userNew }) => {
      const user = await prisma.user.findUnique({
        where: {
          email: userNew.email,
        },
      });
      if (user) {
        throw new AuthenticationError("User already exists with this email");
      }
      const hashedPassowrd = await bcrypt.hash(userNew.password, 10);

      const newUser = await prisma.user.create({
        data: {
          ...userNew,
          password: hashedPassowrd,
        },
      });

      return newUser;
    },
    signinUser: async (_, { userSignin }) => {
      const user = await prisma.user.findUnique({
        where: {
          email: userSignin.email,
        },
      });
      if (!user) {
        throw new AuthenticationError("User does not exist with this email");
      }
      const isPasswordValid = await bcrypt.compare(
        userSignin.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new AuthenticationError("Invalid password");
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET
      );

      return { token };
    },
  },
};
