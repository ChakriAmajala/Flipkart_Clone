const ErrorHandler = require("../utils/errorHandler");

const errorHandler = (err, req, res, next) => {
  // Clone error object
  let error = { ...err };
  error.message = err.message || "Internal Server Error";
  error.statusCode = err.statusCode || 500;

  // 🧠 Handle invalid MongoDB ObjectId (CastError)
  if (error.name === "CastError") {
    const message = `Resource not found. Invalid: ${error.path}`;
    error = new ErrorHandler(message, 400);
  }

  // 🧠 Handle duplicate field values (e.g., duplicate email)
  if (error.code === 11000) {
    const message = `Duplicate field value entered: ${Object.keys(
      error.keyValue
    )}`;
    error = new ErrorHandler(message, 400);
  }

  // 🧠 Handle JWT-related errors
  if (error.name === "JsonWebTokenError") {
    error = new ErrorHandler("Invalid JWT token. Please log in again.", 401);
  }

  if (error.name === "TokenExpiredError") {
    error = new ErrorHandler("JWT token has expired. Please log in again.", 401);
  }

  // 🧠 Handle Mongoose validation errors
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors)
      .map((val) => val.message)
      .join(", ");
    error = new ErrorHandler(message, 400);
  }

  // 🧱 Send final structured error response
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};

module.exports = errorHandler;
