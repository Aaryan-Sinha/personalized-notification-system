const axios = require("axios");
const jwt = require("jsonwebtoken");
const { GraphQLJSONObject } = require("graphql-type-json");

const resolvers = {
  JSON: GraphQLJSONObject, // 🔥 Add JSON scalar here

  Query: {
    me: async (_, { token }) => {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const res = await axios.get(
        `${process.env.USER_SERVICE_URL}/api/users/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },

    unreadNotifications: async (_, { userId }) => {
      const res = await axios.get(
        `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications/unread/${userId}`
      );
      return res.data;
    },

    orders: async (_, { userId }) => {
      const res = await axios.get(
        `${process.env.ORDER_SERVICE_URL}/api/orders/user/${userId}`
      );
      return res.data;
    },
  },

  Mutation: {
    register: async (_, { name, email, password, preferences }) => {
      const res = await axios.post(
        `${process.env.USER_SERVICE_URL}/api/users/register`,
        {
          name,
          email,
          password,
          preferences,
        }
      );
      return res.data.token;
    },

    updatePreferences: async (_, { token, preferences }) => {
      await axios.put(
        `${process.env.USER_SERVICE_URL}/api/users/preferences`,
        { preferences },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return "Preferences updated.";
    },

    createOrder: async (_, { userId, product }) => {
      await axios.post(`${process.env.ORDER_SERVICE_URL}/api/orders`, {
        userId,
        product,
      });
      return "Order created.";
    },
  },
};

module.exports = resolvers;
