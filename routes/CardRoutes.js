const express = require("express");
const jwtVerify = require("../middlewares/authMiddleware");
const { createCard, modify, updateCard, deleteCard, getAllData, checkUncheck, readOnlyDetails } = require("../controllers/CardController");

const router = express.Router();

router.route("/create").post(jwtVerify, createCard);
router.route("/modify").put(jwtVerify, modify);
router.route("/update").put(jwtVerify, updateCard);
router.route("/delete").delete(jwtVerify, deleteCard);
router.route("/getAllCards").get(jwtVerify, getAllData);
router.route("/checkuncheck").put(jwtVerify, checkUncheck);
router.route("/readOnlyDetails").get(readOnlyDetails);


module.exports = router;
