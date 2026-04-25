const stripe = require("../config/stripe");
const { ObjectId } = require("mongodb");
const {
  markParcelAsPaidById,
  createPaymentRecord,
  getPaymentByTransactionId,
  getPaymentsByCustomerEmail,
} = require("../models/payment.model");
const { generateTrackingId } = require("../utils/trackingId");

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
        parcelName: paymentInfo.parcelName,
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

    const transactionId = session.payment_intent;
    const paymentInfo = await getPaymentByTransactionId(transactionId);

    if (paymentInfo?.paymentStatus === "paid") {
      return res.send({
        success: true,
        message: "Payment already processed",
        trackingId: paymentInfo.trackingId,
        paymentId: paymentInfo._id,
      });
    }

    const parcelId = session.metadata?.parcelId;

    if (!parcelId || !ObjectId.isValid(parcelId)) {
      return res
        .status(400)
        .send({ error: "Invalid parcel id in session metadata" });
    }
    const trackingId = generateTrackingId();
    const result = await markParcelAsPaidById(parcelId, trackingId);

    const payment = {
      amount: session.amount_total / 100,
      currency: session.currency,
      customerEmail: session.customer_email,
      parcelId: session.metadata?.parcelId,
      parcelName: session.metadata?.parcelName,
      trackingId: trackingId,
      transactionId: session.payment_intent,
      paymentStatus: session.payment_status,

      createdAt: new Date(),
    };

    const resultPayment = await createPaymentRecord(payment);

    res.send({
      success: true,
      trackingId: trackingId,
      paymentId: resultPayment.insertedId,
    });
  } catch (error) {
    console.error("Error handling payment success:", error);
    res.status(500).send({ error: "Failed to process payment success" });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const email = req?.query?.email;

    const payments = await getPaymentsByCustomerEmail(email);

    res.send({ success: true, payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).send({ error: "Failed to fetch payments" });
  }
};

module.exports = {
  createCheckoutSession,
  handlePaymentSuccess,
  getAllPayments,
};
