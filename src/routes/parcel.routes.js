const express = require("express");
const {
  getParcels,
  getParcelById,
  addParcel,
  removeParcel,
} = require("../controllers/parcel.controller");

const router = express.Router();

router.get("/", getParcels);
router.get("/:id", getParcelById);
router.post("/", addParcel);
router.delete("/:id", removeParcel);

module.exports = router;
