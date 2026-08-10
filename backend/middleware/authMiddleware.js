const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    console.log("Authorization Header:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access Denied. No Token.",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("Extracted Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded);

    req.user = decoded;

    console.log("JWT verified");
    console.log("Calling next()");
    next();
    console.log("Returned from next()");

  } catch (error) {
    console.log("JWT ERROR:", error.message);

    res.status(401).json({
      message: "Invalid Token",
    });
  }
};

module.exports = protect;