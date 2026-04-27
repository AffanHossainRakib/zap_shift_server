const express = require("express");
const {
  createARider,
  getARider,
  getAllRiders,
  updateRiderStatus,
} = require("../controllers/rider.controller");
const router = express.Router();

router.get("/:_id", getARider);
router.get("/", getAllRiders);
router.post("/", createARider);
router.patch("/:_id", updateRiderStatus);

module.exports = router;
