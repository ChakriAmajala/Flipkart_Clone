const express = require("express");
require("dotenv").config();
const ejs = require("ejs");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const errorMiddleware = require("./Middlewares/error");
// const Connection = require("./Config/db.js"); // MongoDB disabled for now

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));
app.use(cors());

// ✅ Temporary route (to test backend)
app.get("/api/v1/test", (req, res) => {
  res.json({ success: true, message: "API working fine without MongoDB 🚀" });
});

// ✅ Comment out MongoDB-based routes for now
// app.use("/api/v1", userRouter);
// app.use("/api/v1", productRouter);
// app.use("/api/v1", orderRouter);
// app.use("/api/v1", paymentRouter);

// ✅ Connection(); // disabled since no MongoDB

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Server is Running! 🚀");
  });
}

app.use(errorMiddleware);

module.exports = app;
