const { createNewUser, findUserByEmail } = require("../models/user.model");

const createUser = async (req, res) => {
  try {
    if (!req.body?.email || !req.body?.name) {
      return res.status(400).send({ error: "Email and name are required" });
    }

    const isUserExist = await findUserByEmail(req.body.email);
    if (isUserExist) {
      return res.status(409).send({ error: "User already exists" });
    }

    const user = await createNewUser(req.body);
    res.status(201).send({
      message: "User created successfully",
      userId: user.insertedId,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ error: "Failed to create user" });
  }
};

const getUser = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(400).send({ error: "Email is required" });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).send({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send({ error: "Failed to fetch user" });
  }
};

module.exports = {
  createUser,
  getUser,
};
