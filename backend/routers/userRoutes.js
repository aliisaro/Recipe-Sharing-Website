const express = require("express");
const router = express.Router();
const users = require("../controllers/userController");

router.get("/api/users/", users.getAllUsers);

router.post("/api/users/", users.addUser);

router.post("/api/users/login", users.loginUser);

router.get("/api/users/:id", users.getUserById);

router.patch("/api/users/:id", users.patchUser);

router.delete("/api/users/:id", users.deleteUser);

module.exports = router;
