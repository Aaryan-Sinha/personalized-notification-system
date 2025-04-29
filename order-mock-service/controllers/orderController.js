const Order = require("../models/Order");
const amqp = require("amqplib");

let channel = null;

// Connect to RabbitMQ
const connectQueue = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue("send_notification");
};
connectQueue();

// Create mock order
exports.createOrder = async (req, res) => {
  const { userId, product } = req.body;

  try {
    const order = await Order.create({ userId, product });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status and notify user
exports.updateOrderStatus = async (req, res) => {
  try {
    const orders = await Order.find({ status: { $ne: "Delivered" } });

    for (let order of orders) {
      if (order.status === "Placed") {
        order.status = "Shipped";
      } else if (order.status === "Shipped") {
        order.status = "Delivered";
      }
      await order.save();

      // Send Notification
      channel.sendToQueue(
        "send_notification",
        Buffer.from(
          JSON.stringify({
            userId: order.userId,
            type: "order_update",
            content: {
              message: `Your order for ${order.product} is now ${order.status}`,
            },
          })
        )
      );
    }

    res.json({ message: "Order statuses updated and notifications sent." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
