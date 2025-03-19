const express = require("express");
const { createaccount} = require("../controllers/accountcontroller");

const router = express.Router();

router.post("/add", createaccount);


module.exports = router;
