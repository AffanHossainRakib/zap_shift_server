const express = require("express");
const cors = require("cors");
const parcelRoutes = require("./routes/parcel.routes");
const paymentRoutes = require("./routes/payment.routes");
const userRoutes = require("./routes/user.route");
const verifyFirebaseToken = require("./middlewares/verifyFirebaseToken");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Zap shift shifting fine.");
});

app.use("/parcels", parcelRoutes);
app.use("/", paymentRoutes);
app.use("/user", userRoutes);

module.exports = app;
