const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

router.post("/login", (req, res) => AuthController.login(req, res));

module.exports = router;