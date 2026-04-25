const express = require("express");
const {
  getParcels,
  getParcelById,
  addParcel,
  removeParcel,
} = require("../controllers/parcel.controller");
const verifyFirebaseToken = require("../middlewares/verifyFirebaseToken");

const router = express.Router();

router.get("/", verifyFirebaseToken, getParcels);
router.get("/:id", verifyFirebaseToken, getParcelById);
router.post("/", verifyFirebaseToken, addParcel);
router.delete("/:id", verifyFirebaseToken, removeParcel);

module.exports = router;
