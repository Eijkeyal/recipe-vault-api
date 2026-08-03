const errorHandler = (err, req, res, next) => {
  if (err.name === "validationError") {
    const messages = Object.values(err.values).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: "validation Check",
      details: messages,
    });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: `${field} '${err.keyValue[field]}' already exists`,
    });
  }
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: `Invalid ${err.path}:${err.value}`,
    });
  }
  console.log("Unhandeled error:", err);
  return res.status(500).json({
    success: false,
    error: "Something went wrong on the server",
  });
};
module.exports = errorHandler;
