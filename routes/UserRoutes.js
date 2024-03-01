const express = require("express");
const { register, login, updatePassword } = require("../controllers/UserController");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/updateUser").put(updatePassword);


module.exports = router;