const { ObjectId } = require("mongodb");
const {
  createANewRider,
  findARider,
  findAllRiders,
  setNewRiderStatus,
} = require("../models/rider.model");

const getARider = async (req, res) => {
  const { _id } = req.params;
  if (_id && !ObjectId.isValid(_id)) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid rider id" });
  }

  const result = await findARider(_id);
  res.send({
    success: true,
    message: "Rider retrieved successfully",
    data: result,
  });
};

const getAllRiders = async (req, res) => {
  const result = await findAllRiders();
  res.send({
    success: true,
    message: "Riders retrieved successfully",
    data: result,
  });
};

const createARider = async (req, res) => {
  try {
    if (!req.body.name || !req.body.email) {
      return res
        .status(400)
        .send({ success: false, message: "Rider name & Email is required" });
    }

    const riderInfo = req.body;
    riderInfo.createdAt = new Date();
    riderInfo.status = "Pending";

    const result = await createANewRider(riderInfo);

    res.send({
      success: true,
      message: "Rider received successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error creating rider" });
  }
};

const updateRiderStatus = async (req, res) => {
  const { _id } = req.params;
  const { status } = req.body;
  if (!ObjectId.isValid(_id)) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid rider id" });
  }

  if (!["Pending", "Approved", "Rejected"].includes(status)) {
    return res.status(400).send({ success: false, message: "Invalid status" });
  }

  try {
    const result = await setNewRiderStatus(_id, status);
    res.send({
      success: true,
      message: "Rider status updated successfully",
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error updating rider status" });
  }
};

module.exports = {
  createARider,
  getARider,
  getAllRiders,
  updateRiderStatus,
};
