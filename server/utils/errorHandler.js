class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Capture stack trace for better debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorHandler;
