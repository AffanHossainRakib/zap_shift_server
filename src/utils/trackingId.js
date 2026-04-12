const crypto = require("crypto");

const generateTrackingId = (prefix = "ZAP") => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();

  return `${prefix}-${datePart}-${randomPart}`;
};

module.exports = {
  generateTrackingId,
};
