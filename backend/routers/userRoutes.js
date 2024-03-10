const express = require("express");
const router = express.Router();
const users = require("../controllers/userController");

router.post("/signup", users.signupUser);

router.post("/signin", users.signinUser);

module.exports = router;
