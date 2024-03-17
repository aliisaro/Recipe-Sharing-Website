const mongoose = require("mongoose");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// sign in a user
const signinUser = async (req, res) => {
  const { username, hashedPassword } = req.body;

  try {
    const user = await User.signin(username, hashedPassword);

    // create a token
    const token = createToken(user._id);
    const _id = user._id;

    res
      .status(200)
      .json({ message: "Sign in successful", _id, username, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup a user
const signupUser = async (req, res) => {
  const { username, email, hashedPassword } = req.body;

  try {
    const user = await User.signup(username, email, hashedPassword);

    // create a token
    const token = createToken(user._id);
    const _id = user._id;

    res
      .status(200)
      .json({ message: "Sign up successful", _id, username, email, token });
  } catch (error) {
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

module.exports = { signupUser, signinUser, getUserByUsername };
