const express = require("express");
const Account = require("../controllers/accountcontroller");

const router = express.Router();

router.post("/addaccount", Account.createaccount);
router.get("/getaccount/:accno",Account.getaccountbyid);
router.get("/getaccount",Account.getaccount);
router.put("/updateaccount/:accno",Account.updateaccount);
router.put("/deposit/:accno",Account.deposit);
routr.put("/withdraw/:accno",Account.withdraw);



module.exports = router;
