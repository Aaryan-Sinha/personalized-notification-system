const express = require("express");
const router = express.Router();
const {
  registerUser,
  updatePreferences,
  getUserDetails,
} = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.put("/preferences", protect, updatePreferences);
router.get("/me", protect, getUserDetails);

module.exports = router;
