const { ObjectId } = require("mongodb");
const {
  findAllParcels,
  findParcelById,
  createParcel,
  deleteParcelById,
} = require("../models/parcel.model");

const getParcels = async (req, res) => {
  try {
    if (req?.decoded?.email !== req.query.email) {
      return res.status(403).send({ error: "Forbidden access" });
    }

    const { email } = req.query;
    const result = await findAllParcels(email);
    res.send(result);
  } catch (error) {
    console.error("Error fetching parcels:", error);
    res.status(500).send({ error: "Failed to fetch parcels" });
  }
};

const getParcelById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid parcel id" });
    }

    const result = await findParcelById(id);

    if (!result) {
      return res.status(404).send({ error: "Parcel not found" });
    }

    res.send(result);
  } catch (error) {
    console.error("Error fetching parcel:", error);
    res.status(500).send({ error: "Failed to fetch parcel" });
  }
};

const addParcel = async (req, res) => {
  try {
    const parcel = req.body;

    if (!parcel || typeof parcel !== "object" || Array.isArray(parcel)) {
      return res.status(400).send({ error: "Invalid parcel payload" });
    }

    const result = await createParcel(parcel);
    res.send(result);
  } catch (error) {
    console.error("Error creating parcel:", error);
    res.status(500).send({ error: "Failed to create parcel" });
  }
};

const removeParcel = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid parcel id" });
    }

    const result = await deleteParcelById(id);

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "Parcel not found" });
    }

    res.send(result);
  } catch (error) {
    console.error("Error deleting parcel:", error);
    res.status(500).send({ error: "Failed to delete parcel" });
  }
};

module.exports = {
  getParcels,
  getParcelById,
  addParcel,
  removeParcel,
};
