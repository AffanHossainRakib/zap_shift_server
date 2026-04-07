const { ObjectId } = require("mongodb");
const { getParcelsCollection } = require("../config/db");

const findAllParcels = async (email) => {
  const collection = await getParcelsCollection();
  const query = {};
  if (email) {
    query.senderEmail = email;
  }
  return collection.find(query, { sort: { createdAt: -1 } }).toArray();
};

const findParcelById = async (id) => {
  const collection = await getParcelsCollection();
  return collection.findOne({ _id: new ObjectId(id) });
};

const createParcel = async (parcel) => {
  const collection = await getParcelsCollection();
  const doc = {
    ...parcel,
    createdAt: new Date(),
  };

  return collection.insertOne(doc);
};

const deleteParcelById = async (id) => {
  const collection = await getParcelsCollection();
  return collection.deleteOne({ _id: new ObjectId(id) });
}

module.exports = {
  findAllParcels,
  findParcelById,
  createParcel,
  deleteParcelById,
};
