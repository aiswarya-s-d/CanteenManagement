const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { getProfile,getDashboardStats,getAdminDashboardStats } = require("../controllers/userController");
router.get(
  "/profile",
  verifyToken,
  getProfile
);
router.get(
  "/dashboard-stats",
  verifyToken,
  getDashboardStats
);
router.get(
  "/admin/dashboard-stats",verifyToken,
  getAdminDashboardStats);
module.exports = router;