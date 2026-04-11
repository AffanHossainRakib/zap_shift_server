const stripe = require("../config/stripe");
const { ObjectId } = require("mongodb");
const { markParcelAsPaidById } = require("../models/payment.model");

const createCheckoutSession = async (req, res) => {
  try {
    const paymentInfo = req.body;

    const amountInCents = Math.round(Number(paymentInfo?.cost) * 100);
    if (!Number.isFinite(amountInCents) || amountInCents <= 0) {
      return res.status(400).send({ error: "Invalid payment cost" });
    }

    if (
      !paymentInfo?.parcelName ||
      !paymentInfo?.senderEmail ||
      !paymentInfo?.parcelId
    ) {
      return res.status(400).send({ error: "Missing required payment fields" });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "USD",
            unit_amount: amountInCents,
            product_data: {
              name: paymentInfo.parcelName,
            },
          },
          quantity: 1,
        },
      ],
      customer_email: paymentInfo.senderEmail,
      mode: "payment",
      metadata: {
        parcelId: paymentInfo.parcelId,
      },
      success_url: `${process.env.CLIENT_URL}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard/payment-cancelled`,
    });

    res.status(200).send({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).send({ error: "Failed to create checkout session" });
  }
};

const handlePaymentSuccess = async (req, res) => {
  try {
    const sessionId = req.query.sessionId;

    if (!sessionId) {
      return res.status(400).send({ error: "sessionId is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.send({ success: false });
    }

    const parcelId = session.metadata?.parcelId;

    if (!parcelId || !ObjectId.isValid(parcelId)) {
      return res
        .status(400)
        .send({ error: "Invalid parcel id in session metadata" });
    }

    const result = await markParcelAsPaidById(parcelId);

    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    );

    res.send({ success: true });
  } catch (error) {
    console.error("Error handling payment success:", error);
    res.status(500).send({ error: "Failed to process payment success" });
  }
};

module.exports = {
  createCheckoutSession,
  handlePaymentSuccess,
};
