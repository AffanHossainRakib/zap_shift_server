const { ObjectId } = require("mongodb");
const { getParcelsCollection, getPaymentCollection } = require("../config/db");

const markParcelAsPaidById = async (parcelId, trackingId) => {
  const collection = await getParcelsCollection();

  return collection.updateOne(
    { _id: new ObjectId(parcelId) },
    {
      $set: {
        paymentStatus: "paid",
        trackingId: trackingId,
      },
    },
  );
};

const createPaymentRecord = async (payment) => {
  const collection = await getPaymentCollection();
  return collection.insertOne(payment);
};

const getPaymentByTransactionId = async (transactionId) => {
  const collection = await getPaymentCollection();
  return await collection.findOne({ transactionId: transactionId });
};

const getPaymentsByCustomerEmail = async (email) => {
  const query = {};
  if (email) {
    query.customerEmail = email;
  }
  const collection = await getPaymentCollection();
  const cursor = collection.find(query);
  const result = await cursor.toArray();
  return result;
};

module.exports = {
  markParcelAsPaidById,
  createPaymentRecord,
  getPaymentByTransactionId,
  getPaymentsByCustomerEmail,
};
