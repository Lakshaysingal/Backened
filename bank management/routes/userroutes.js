const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Accountholder = require("../models/account");


router.post("/adduser", async (req, res) => {
  try {
    const { username,name, email, password, mobno, address } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: "Username already taken" });
    const user = await User.create({ username,name, email, password, mobno, address });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});






// router.get("/alluser",async(req,res)=>{

// });

module.exports=router;
