require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");
const customMiddleware = require("./middleware/customMiddleware");
const userRoutes = require("./routers/userRoutes");
const recipeRoutes = require("./routers/recipeRoutes");
const fileRoutes = require("./routers/fileRoutes");
const path = require('path');
const { initGFS } = require("./config/gfs");

// express app
const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.send("API Running!"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
//app.use("/api/files", fileRoutes); // <-- new route for fetching GridFS images

// Error handling
app.use(customMiddleware.requestLogger);
app.use(customMiddleware.unknownEndpoint);
app.use(customMiddleware.errorHandler);

// Init GFS once DB is ready
//mongoose.connection.once("open", () => {
//  initGFS(mongoose.connection, mongoose.mongo);
//});

module.exports = app;
