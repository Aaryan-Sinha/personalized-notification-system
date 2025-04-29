const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const recommendationRoutes = require("./routes/recommendationRoutes");
const cron = require("node-cron");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/recommendations", recommendationRoutes);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () =>
  console.log(`Recommendation Service running on port ${PORT}`)
);

// Setup Scheduled Job
const {
  generateRecommendations,
} = require("./controllers/recommendationController");

// Schedule to run every minute for demo
cron.schedule("* * * * *", async () => {
  console.log("Running scheduled recommendation job...");
  await generateRecommendations(
    { body: {} },
    { json: (msg) => console.log(msg) }
  );
});
