const { ObjectId } = require("mongodb");
const { getRiderCollection } = require("../config/db");

const createANewRider = async (riderInfo) => {
  const collection = await getRiderCollection();
  return collection.insertOne(riderInfo);
};

const findARider = async (id) => {
  const query = {};
  if (id) {
    query._id = new ObjectId(id);
  }
  const collection = await getRiderCollection();
  return collection.findOne(query);
};

const findAllRiders = async () => {
  const collection = await getRiderCollection();
  return collection.find({}).toArray();
};

module.exports = {
  createANewRider,
  findARider,
  findAllRiders,
};
