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

    res.status(200).json({ message:"Sign in successful", username, token });
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

    res.status(200).json({ message:"Sign up successful", username, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signupUser, signinUser };
