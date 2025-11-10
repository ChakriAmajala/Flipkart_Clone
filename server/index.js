const app = require('./app');
const cloudinary = require('cloudinary').v2;
const PORT = process.env.PORT || 4000;

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.log(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// Start Server — bind to 0.0.0.0 so Docker can reach it
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.log(`❌ Unhandled Promise Rejection: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});


