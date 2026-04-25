const express = require("express");
const verifyFirebaseToken = require("../middlewares/verifyFirebaseToken");
const { createUser, getUser } = require("../controllers/user.controller");

const router = express.Router();

router.get("/", getUser);
router.post("/", createUser);

module.exports = router;
