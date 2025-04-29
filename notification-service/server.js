const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const notificationRoutes = require("./routes/notificationRoutes");
const amqp = require("amqplib");
const Notification = require("./models/Notification");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/notifications", notificationRoutes);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () =>
  console.log(`Notification Service running on port ${PORT}`)
);

// Listen to RabbitMQ events
const listenForMessages = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue("send_notification");

  channel.consume("send_notification", async (msg) => {
    const data = JSON.parse(msg.content.toString());

    // Create Notification
    await Notification.create({
      userId: data.userId,
      type: data.type,
      content: data.content,
    });

    console.log("Notification saved:", data);
    channel.ack(msg);
  });
};

listenForMessages();
