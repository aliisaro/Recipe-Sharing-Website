const mongoose = require("mongoose");
const User = require("../models/Users");
const Recipe = require("../models/Recipe");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// Sign in a user
const signinUser = async (req, res) => {
  console.log("Signin request body:", req.body);
  const { username, password } = req.body;

  try {
    const user = await User.signin(username, password);

    // create a token
    const token = createToken(user._id);
    const _id = user._id;

    res
      .status(200)
      .json({ message: "Sign in successful", _id, username, token });
  } catch (error) {
    console.error("Sign in error:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Signup a user
const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  console.log("Signup request body:", req.body);

  try {
    const user = await User.signup(username, email, password);

    // create a token
    const token = createToken(user._id);
    const _id = user._id;

    res
      .status(200)
      .json({ message: "Sign up successful", _id, username, email, token });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Fetch user error:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
};

// Update user
const patchUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Build updateFields only with provided fields
    let updateFields = {};
    if (username !== undefined) updateFields.username = username;
    if (email !== undefined) updateFields.email = email;
    if (password !== undefined) updateFields.password = password;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ msg: "No valid fields to update" });
    }

    // If password is being updated, hash it before saving
    if (updateFields.password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(updateFields.password, salt);
    }

    // Update by user ID instead of username
    const user = await User.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all recipes created by this user
    const recipesToDelete = await Recipe.find({ user_id: userId });
    const recipeIds = recipesToDelete.map((r) => r._id);

    // Remove recipes from DB
    await Recipe.deleteMany({ user_id: userId });

    // Remove these recipes from all users' savedRecipes
    await User.updateMany(
      { savedRecipes: { $in: recipeIds } },
      { $pull: { savedRecipes: { $in: recipeIds } } },
    );

    // Delete the user
    await User.deleteOne({ _id: userId });

    res
      .status(200)
      .json({ message: "User and their recipes deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signupUser, signinUser, getUserById, patchUser, deleteUser };
