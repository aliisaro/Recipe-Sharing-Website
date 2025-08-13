const express = require("express");
const router = express.Router();
const users = require("../controllers/userController");

router.post("/signup", users.signupUser);

router.post("/signin", users.signinUser);

router.get("/profile/:id", users.getUserById);

router.patch("/update/:id", users.patchUser);

router.delete("/delete/:id", users.deleteUser);

module.exports = router;
