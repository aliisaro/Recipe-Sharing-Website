require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");
const customMiddleware = require("./middleware/customMiddleware");
const userRoutes = require("./routers/userRoutes");
const recipeRoutes = require("./routers/recipeRoutes");
const path = require('path');

// express app
const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: "10mb" })); // increase limit for Base64
//app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.send("API Running!"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);

// Error handling
app.use(customMiddleware.requestLogger);
app.use(customMiddleware.unknownEndpoint);
app.use(customMiddleware.errorHandler);

module.exports = app;
