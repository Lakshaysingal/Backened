const express = require("express");
const Account = require("../controllers/accountcontroller");

const router = express.Router();

router.post("/addaccount", Account.createaccount);
router.get("/getaccount/:accno",Account.getaccountbyid);
router.get("/getaccount",Account.getaccount);
router.put("/updateaccount/:accno",Account.updateaccount);
router.put("/deposit/:accno",Account.deposit);
router.put("/withdraw/:accno",Account.withdraw);
router.get("/transactions/:accno",Account.transaction);
router.put("transfer",Account.transferfunds);
router.delete("/deleteaccount/:accno",Account.deleteaccount);
router.get("/currentbalance/:accno",Account.curentbalance);
router.get("/searchaccount",Account.search);








module.exports = router;
