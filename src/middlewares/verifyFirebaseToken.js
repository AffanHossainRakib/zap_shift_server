const admin = require("../config/firebaseAdmin");

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authorization = req.headers?.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).send({ error: "Unauthorized access" });
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return res.status(401).send({ error: "Unauthorized access" });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.decoded = decodedToken;

    next();
  } catch (error) {
    console.error("Error verifying Firebase token:", error.message);
    res.status(401).send({ error: "Unauthorized access" });
  }
};

module.exports = verifyFirebaseToken;
