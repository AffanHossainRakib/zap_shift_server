const express = require("express");
const verifyFirebaseToken = require("../middlewares/verifyFirebaseToken");
const {
  createUser,
  getUser,
  updateUserRole,
} = require("../controllers/user.controller");

const router = express.Router();

router.get("/", getUser);
router.post("/", createUser);
router.patch("/:id", updateUserRole);
module.exports = router;
