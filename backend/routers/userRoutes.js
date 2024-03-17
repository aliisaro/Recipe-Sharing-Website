const express = require("express");
const router = express.Router();
const users = require("../controllers/userController");

router.post("/signup", users.signupUser);

router.post("/signin", users.signinUser);

router.get("/profile/:username", users.getUserByUsername);

router.patch("/update/:username", users.patchUser);

module.exports = router;
