const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  browsingHistory: [{ type: String }], // list of product categories browsed
  purchaseHistory: [{ type: String }], // list of product IDs purchased
});

module.exports = mongoose.model("Activity", activitySchema);
