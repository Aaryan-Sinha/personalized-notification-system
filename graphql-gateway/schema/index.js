const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar JSON
  type User {
    id: ID
    name: String
    email: String
    preferences: [String]
  }

  type Notification {
    id: ID
    type: String
    content: JSON
    sentAt: String
    read: Boolean
  }

  type Order {
    id: ID
    product: String
    status: String
  }

  type Query {
    me(token: String!): User
    unreadNotifications(userId: String!): [Notification]
    orders(userId: String!): [Order]
  }

  type Mutation {
    register(
      name: String!
      email: String!
      password: String!
      preferences: [String]!
    ): String
    updatePreferences(token: String!, preferences: [String]!): String
    createOrder(userId: String!, product: String!): String
  }
`;

module.exports = typeDefs;
