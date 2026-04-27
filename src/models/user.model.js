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

const setUserRole = async (email, role) => {
  const collection = await getUserCollection();
  return collection.updateOne({ email }, { $set: { role } });
};

const findAllUsers = async () => {
  const collection = await getUserCollection();
  return collection.find({}).toArray();
};

module.exports = {
  createNewUser,
  findUserByEmail,
  setUserRole,
  findAllUsers,
};
