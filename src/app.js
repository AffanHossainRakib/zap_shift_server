const express = require("express");
const cors = require("cors");
const parcelRoutes = require("./routes/parcel.routes");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Zap shift shifting fine.");
});

app.use("/parcels", parcelRoutes);

module.exports = app;
