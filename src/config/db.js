const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined in environment variables.");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let dbConnected = false;
let parcelsCollection;

const getParcelsCollection = async () => {
  if (dbConnected && parcelsCollection) {
    return parcelsCollection;
  }

  await client.connect();
  const db = client.db("zap_shift_db");
  parcelsCollection = db.collection("parcels");
  dbConnected = true;

  return parcelsCollection;
};

module.exports = {
  getParcelsCollection,
};
