const mongoose = require("mongoose");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// sign in a user
const signinUser = async (req, res) => {
  console.log("Signin request body:", req.body);  // <-- Add this
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

// signup a user
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

const getUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

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

    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      updateFields,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signupUser, signinUser, getUserByUsername, patchUser };
