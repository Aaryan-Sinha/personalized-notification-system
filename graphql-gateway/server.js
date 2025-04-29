const express = require("express");
const { GraphQLJSONObject } = require("graphql-type-json");

const { ApolloServer } = require("apollo-server-express");
const dotenv = require("dotenv");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

dotenv.config();

const startServer = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(
      `🚀 GraphQL Gateway running at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
};

startServer();
