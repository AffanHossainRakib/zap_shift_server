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

module.exports = {
  markParcelAsPaidById,
  createPaymentRecord,
};
