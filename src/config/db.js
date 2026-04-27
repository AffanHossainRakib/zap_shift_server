const dns = require("node:dns");
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI;
const fallbackUri = process.env.MONGODB_URI_FALLBACK;

if (!uri) {
  throw new Error("MONGODB_URI is not defined in environment variables.");
}

const buildClient = (mongoUri) =>
  new MongoClient(mongoUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

const configureDnsForAtlasSrv = () => {
  if (!uri.startsWith("mongodb+srv://")) {
    return;
  }

  const dnsServers = (process.env.MONGODB_DNS_SERVERS || "8.8.8.8,1.1.1.1")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers.length === 0) {
    return;
  }

  dns.setServers(dnsServers);
  console.log(
    `Using DNS servers for MongoDB SRV lookup: ${dnsServers.join(", ")}`,
  );
};

let client;

let dbConnected = false;
let parcelsCollection, paymentCollection, userCollection, riderCollection;
let initPromise = null;

const initCollections = async () => {
  if (
    dbConnected &&
    parcelsCollection &&
    paymentCollection &&
    userCollection &&
    riderCollection
  ) {
    return;
  }

  if (initPromise) {
    await initPromise;
    return;
  }

  initPromise = (async () => {
    configureDnsForAtlasSrv();

    client = buildClient(uri);

    try {
      await client.connect();
    } catch (error) {
      const isSrvRefused =
        error &&
        error.code === "ECONNREFUSED" &&
        error.syscall === "querySrv" &&
        uri.startsWith("mongodb+srv://");

      if (!isSrvRefused || !fallbackUri) {
        throw error;
      }

      console.warn(
        "SRV DNS lookup failed with ECONNREFUSED. Retrying with MONGODB_URI_FALLBACK.",
      );

      client = buildClient(fallbackUri);
      await client.connect();
    }

    const db = client.db("zap_shift_db");
    parcelsCollection = db.collection("parcels");
    paymentCollection = db.collection("payments");
    userCollection = db.collection("users");
    riderCollection = db.collection("riders");
    dbConnected = true;
  })();

  try {
    await initPromise;
  } catch (error) {
    dbConnected = false;
    parcelsCollection = undefined;
    paymentCollection = undefined;
    userCollection = undefined;
    riderCollection = undefined;
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

const getUserCollection = async () => {
  await initCollections();

  return userCollection;
};

const getRiderCollection = async () => {
  await initCollections();
  return riderCollection;
};

module.exports = {
  getParcelsCollection,
  getPaymentCollection,
  getUserCollection,
  getRiderCollection,
};
