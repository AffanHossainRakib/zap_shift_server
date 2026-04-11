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
let paymentCollection;
let initPromise = null;

const initCollections = async () => {
  if (dbConnected && parcelsCollection && paymentCollection) {
    return;
  }

  if (initPromise) {
    await initPromise;
    return;
  }

  initPromise = (async () => {
    await client.connect();
    const db = client.db("zap_shift_db");
    parcelsCollection = db.collection("parcels");
    paymentCollection = db.collection("payment");
    dbConnected = true;
  })();

  try {
    await initPromise;
  } catch (error) {
    dbConnected = false;
    parcelsCollection = undefined;
    paymentCollection = undefined;
    throw error;
  } finally {
    initPromise = null;
  }
};

const getParcelsCollection = async () => {
  await initCollections();

  return parcelsCollection;
};

const getPaymentCollection = async () => {
  await initCollections();

  return paymentCollection;
};

module.exports = {
  getParcelsCollection,
  getPaymentCollection,
};
