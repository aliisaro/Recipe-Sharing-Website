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

connectDB();

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API Running!"));

app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(customMiddleware.requestLogger);
app.use(customMiddleware.unknownEndpoint);
app.use(customMiddleware.errorHandler);

module.exports = app;
