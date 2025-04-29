const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const amqp = require("amqplib");
const axios = require("axios"); // ✅ Add axios for internal service communication
const User = require("../models/User");

let channel = null;

// Connect to RabbitMQ
const connectQueue = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue("user_registered");
};
connectQueue();

// @desc Register User
exports.registerUser = async (req, res) => {
  const { name, email, password, preferences } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      preferences,
    });

    const payload = { id: user.id };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Emit event to queue
    channel.sendToQueue(
      "user_registered",
      Buffer.from(
        JSON.stringify({
          userId: user._id,
          email: user.email,
          preferences: user.preferences,
        })
      )
    );

    // ✅ Automatically create mock activity for recommendation-service
    try {
      await axios.post(
        `${process.env.RECOMMENDATION_SERVICE_URL}/api/recommendations/activity`,
        {
          userId: user._id,
          browsingHistory: preferences || ["electronics", "books"], // You can tweak these
          purchaseHistory: ["mock-product-1", "mock-product-2"],
        }
      );
      console.log(`✅ Mock activity created for user ${user._id}`);
    } catch (activityError) {
      console.error(
        "❌ Failed to create mock activity:",
        activityError.message
      );
    }

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update User Preferences
exports.updatePreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.preferences = req.body.preferences || user.preferences;
    await user.save();

    res.json({ message: "Preferences updated", preferences: user.preferences });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get User Details (Fixed id mapping)
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    // Map _id to id
    const userObj = user.toObject();
    userObj.id = userObj._id;
    delete userObj._id;

    res.json(userObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
