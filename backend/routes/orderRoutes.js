const express = require("express");
const router = express.Router();
const {
    placeOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    verifyOtp,
    getMyOrders,
    updatePaymentStatus,
    getTopSellingItems,
    getOrderSuccessChart
} = require("../controllers/orderController");
router.post("/place", placeOrder);
router.get("/", getAllOrders);
router.get("/top-selling-items",getTopSellingItems);
router.get("/order-success-chart",getOrderSuccessChart);
router.get("/user/:user_id", getMyOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);
router.put("/:id/verify-otp", verifyOtp);
router.put("/:id/payment-status", updatePaymentStatus);
module.exports = router;