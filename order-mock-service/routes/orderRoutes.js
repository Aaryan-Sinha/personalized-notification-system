const express = require("express");
const router = express.Router();
const {
  createOrder,
  updateOrderStatus,
} = require("../controllers/orderController");

router.post("/", createOrder);
router.put("/update-status", updateOrderStatus);

module.exports = router;
