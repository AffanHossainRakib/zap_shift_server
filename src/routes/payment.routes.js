const express = require("express");
const {
  createCheckoutSession,
  handlePaymentSuccess,
  getAllPayments,
} = require("../controllers/payment.controller");
const verifyFirebaseToken = require("../middlewares/verifyFirebaseToken");

const router = express.Router();

router.post(
  "/create-checkout-session",
  verifyFirebaseToken,
  createCheckoutSession,
);
router.patch("/payment-success", verifyFirebaseToken, handlePaymentSuccess);
router.get("/payments", verifyFirebaseToken, getAllPayments);

module.exports = router;
