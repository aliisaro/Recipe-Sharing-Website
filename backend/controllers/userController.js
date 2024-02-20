const userSchema = require("../models/Users");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");
const requireAuth = require("../requireAuth");

const SECRET = "secretword";
const createToken = (_id) => {
  return jwt.sign({ _id }, SECRET, { expiresIn: "3d" });
};

// Get All users
const getAllUsers = async (req, res) => {
  try {
    const users = await userSchema.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a New user
const addUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Create a new user document and save it to the database
    const newUser = new userSchema({ username, email, hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userSchema.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Create JWT token
    const token = createToken(user._id);
    res.status(200).json({ message: "Authentication successful", token });
  } catch (error) {
    res.status(400).json({ message: "Authentication failed" });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await userSchema.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user by id (PATCH)
const patchUser = async (req, res) => {
  try {
    const user = await userSchema.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user by ID
const deleteUser = async (req, res) => {
  try {
    const user = await userSchema.findOneAndDelete({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }
    res.json({ msg: "user deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  loginUser,
  addUser,
  getUserById,
  patchUser,
  deleteUser,
};
