const express = require("express");
const cors = require("cors");
const error = require("./middleware/errorMiddleware");
const found = require("./middleware/notFoundMiddleware");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// Body Parser Middleware
app.use(express.json());

// Init middleware
app.use(error);

app.use("", require("./routers/userRoutes"));

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Body Parser Middleware
app.use(express.json());

app.use(found);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
