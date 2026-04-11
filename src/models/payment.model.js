const { ObjectId } = require("mongodb");
const { getParcelsCollection } = require("../config/db");

const markParcelAsPaidById = async (parcelId) => {
  const collection = await getParcelsCollection();

  return collection.updateOne(
    { _id: new ObjectId(parcelId) },
    {
      $set: {
        paymentStatus: "paid",
      },
    },
  );
};

module.exports = {
  markParcelAsPaidById,
};
