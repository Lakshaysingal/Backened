const express = require("express");
const loan=require("../controllers/loancontroller");

const router = express.Router();



router.post("/apply-loan",loan.applyloan);





module.exports=router;