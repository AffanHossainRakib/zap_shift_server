const { ObjectId } = require("mongodb");
const { getUserCollection } = require("../config/db");

const createNewUser = async (userInfo) => {
  const collection = await getUserCollection();
  const doc = {
    ...userInfo,
    role: "user",
    createdAt: new Date(),
  };

  return collection.insertOne(doc);
};

const findUserByEmail = async (email) => {
  const collection = await getUserCollection();
  return collection.findOne({ email });
};

module.exports = {
  createNewUser,
  findUserByEmail,
};
