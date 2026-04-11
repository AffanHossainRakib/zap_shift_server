const express = require("express");
const {
  createCheckoutSession,
  handlePaymentSuccess,
} = require("../controllers/payment.controller");

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.patch("/payment-success", handlePaymentSuccess);

module.exports = router;
