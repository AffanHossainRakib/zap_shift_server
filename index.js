const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Database connection function
let dbConnected = false;
let parcelsCollection;

async function connectToDatabase() {
  if (dbConnected && parcelsCollection) {
    return parcelsCollection;
  }

  try {
    await client.connect();
    const db = client.db("zap_shift_db");
    parcelsCollection = db.collection("parcels");
    dbConnected = true;
    console.log("Connected to MongoDB");
    return parcelsCollection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// Routes
app.get("/", (req, res) => {
  res.send("Zap shift shifting fine.");
});

// Parcel routes - connect to database on each request
app.get("/parcels", async (req, res) => {
  try {
    const collection = await connectToDatabase();
    const query = {};
    const { email } = req.query;
    if (email) {
      query.senderEmail = email;
    }
    const options = { sort: { createdAt: -1 } };
    const cursor = collection.find(query, options);
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching parcels:", error);
    res.status(500).send({ error: "Failed to fetch parcels" });
  }
});

app.get("/parcels/:id", async (req, res) => {
  try {
    const collection = await connectToDatabase();
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await collection.findOne(query);
    if (!result) {
      return res.status(404).send({ error: "Parcel not found" });
    }
    res.send(result);
  } catch (error) {
    console.error("Error fetching parcel:", error);
    res.status(500).send({ error: "Failed to fetch parcel" });
  }
});

app.post("/parcels", async (req, res) => {
  try {
    const collection = await connectToDatabase();
    const parcel = req.body;
    parcel.createdAt = new Date();
    const result = await collection.insertOne(parcel);
    res.send(result);
  } catch (error) {
    console.error("Error creating parcel:", error);
    res.status(500).send({ error: "Failed to create parcel" });
  }
});

app.delete("/parcels/:id", async (req, res) => {
  try {
    const collection = await connectToDatabase();
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await collection.deleteOne(query);
    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "Parcel not found" });
    }
    res.send(result);
  } catch (error) {
    console.error("Error deleting parcel:", error);
    res.status(500).send({ error: "Failed to delete parcel" });
  }
});

// Don't use app.listen() - export for Vercel instead
module.exports = app;

// Only listen locally when running directly
if (process.env.NODE_ENV !== "production" && require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
