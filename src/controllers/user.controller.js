const { ObjectId } = require("mongodb");
const {
  createNewUser,
  findUserByEmail,
  findAllUsers,
  setUserRolebyId,
} = require("../models/user.model");

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
    const email = req.body?.email;
    if (!email) {
      const users = await findAllUsers();
      return res.status(200).send({ users });
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

const updateUserRole = async (req, res) => {
  try {
    const id = req.params.id;
    const { role } = req.body;

    if (!id || !role) {
      return res.status(400).send({ error: "User ID and role are required" });
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid user ID" });
    }

    if (!["user", "admin", "rider"].includes(role)) {
      return res.status(400).send({ error: "Invalid role value" });
    }

    const result = await setUserRolebyId(id, role);
    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .send({ error: "User not found or role unchanged" });
    }
    res.status(200).send({ message: "User role updated successfully" });
  } catch (error) {
    console.error(req.body);
    console.error("Error updating user role:", error);
    res.status(500).send({ error: "Failed to update user role" });
  }
};

module.exports = {
  createUser,
  getUser,
  updateUserRole,
};
