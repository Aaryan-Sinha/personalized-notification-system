const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");
const cron = require("node-cron");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/orders", orderRoutes);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const PORT = process.env.PORT || 5003;

app.listen(PORT, () =>
  console.log(`Order Mock Service running on port ${PORT}`)
);

// Schedule order status updates every 2 minutes
const { updateOrderStatus } = require("./controllers/orderController");

cron.schedule("*/2 * * * *", async () => {
  console.log("Running scheduled order status update...");
  await updateOrderStatus({ body: {} }, { json: (msg) => console.log(msg) });
});
