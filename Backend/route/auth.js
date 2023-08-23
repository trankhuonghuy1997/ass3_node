const express = require("express");

const router = express.Router();

const authController = require("../controller/auth");
router.get("/name/:id", authController.getName);

router.post("/signup", authController.postSignup);

router.post("/users", authController.postLogin);

module.exports = router;
