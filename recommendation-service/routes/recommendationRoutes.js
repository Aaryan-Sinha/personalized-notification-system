const express = require("express");
const router = express.Router();
const {
  generateRecommendations,
  createActivity,
} = require("../controllers/recommendationController");

router.post("/activity", createActivity); // Create mock browsing/purchase history
router.post("/recommend", generateRecommendations); // Trigger sending recommendations

module.exports = router;
