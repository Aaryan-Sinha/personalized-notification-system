const Activity = require("../models/Activity");
const amqp = require("amqplib");

let channel = null;

// Connect to RabbitMQ
const connectQueue = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue("send_notification");
};
connectQueue();

// Mock recommendation based on browsing and purchases
exports.generateRecommendations = async (req, res) => {
  try {
    const activities = await Activity.find({});

    activities.forEach((activity) => {
      const recommendedProduct =
        activity.browsingHistory[
          Math.floor(Math.random() * activity.browsingHistory.length)
        ] || "generic_product";

      // Send a notification event
      channel.sendToQueue(
        "send_notification",
        Buffer.from(
          JSON.stringify({
            userId: activity.userId,
            type: "recommendation",
            content: {
              message: `We think you might like products in: ${recommendedProduct}`,
            },
          })
        )
      );
    });

    res.json({ message: "Recommendations sent!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create mock user activity
exports.createActivity = async (req, res) => {
  const { userId, browsingHistory, purchaseHistory } = req.body;

  try {
    const activity = await Activity.create({
      userId,
      browsingHistory,
      purchaseHistory,
    });
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
