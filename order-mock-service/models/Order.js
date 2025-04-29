const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  product: { type: String, required: true },
  status: {
    type: String,
    enum: ["Placed", "Shipped", "Delivered"],
    default: "Placed",
  },
});

module.exports = mongoose.model("Order", orderSchema);
