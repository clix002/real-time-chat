import { ApolloServer, gql } from "apollo-server";

const users = [
  {
    id: 1,
    firstName: "Juan",
    lastName: "Perez",
    email: "juan@gmail.com",
    password: "123456",
  },
  {
    id: 2,
    firstName: "Maria",
    lastName: "Gomez",
    email: "maria@gmail.com",
    password: "123456",
  },
];

const todos = [
  {
    title: "Comprar pan",
    by: 1,
  },
  {
    title: "Sacar al perro",
    by: 2,
  },
  {
    title: "Hacer tarea",
    by: 1,
  },
];

// es para definir los tipos de datos que se van a usar
const typeDefs = gql`
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

  type Mutation {
    createUser(userNew: UserInput!): User
    updateUser(id: ID, userUpdate: UserInput): User
    deleteUser(id: ID): User
  }

  type User {
    id: ID
    firstName: String
    lastName: String
    email: String
    todos: [Todo]
  }

  type Todo {
    title: String
    by: ID!
  }
`;

// es para definir las funciones que se van a ejecutar
const resolvers = {
  Query: {
    users: () => users,
    user: (parent, args, context, info) => {
      if (!context.useLogin) {
        throw new Error("No estas autorizado");
      }
      return users.find((user) => user.id == args.id);
    },
  },
  User: {
    todos: (parent, args, context, info) => {
      return todos.filter((todo) => todo.by == parent.id);
    },
  },
  Mutation: {
    createUser: (parent, args, context, info) => {
      const newUser = {
        id: users.length + 1,
        ...args.userNew,
      };
      users.push(newUser);
      return newUser;
    },
    //,
    // updateUser: (parent, args, context, info) => {
    //   let userUpdate = users.find((user) => user.id == args.id);
    //   userUpdate = { ...userUpdate, ...args.userUpdate };
    //   return userUpdate;
    // },
    // deleteUser: (parent, args, context, info) => {
    //   const userDelete = users.find((user) => user.id == args.id);
    //   users = users.filter((user) => user.id != args.id);
    //   return userDelete;
    // },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    useLogin: true,
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server is running at ${url} `);
});
