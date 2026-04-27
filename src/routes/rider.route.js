const express = require("express");
const {
  createARider,
  getARider,
  getAllRiders,
} = require("../controllers/rider.controller");
const router = express.Router();

router.get("/:_id", getARider);
router.get("/", getAllRiders);
router.post("/", createARider);

module.exports = router;
