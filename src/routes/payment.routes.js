const express = require("express");
const {
  createCheckoutSession,
  handlePaymentSuccess,
  getAllPayments,
} = require("../controllers/payment.controller");

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.patch("/payment-success", handlePaymentSuccess);
router.get("/payments", getAllPayments);

module.exports = router;
