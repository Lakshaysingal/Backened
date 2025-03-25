const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Accountholder = require("../models/account");

const generateAccountNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10-digit account number
};

router.post("/userbank", async (req, res) => {
  try {
      const { username, balance, accountType } = req.body;

      // Step 1: Check if the user exists
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(400).json({ error: "User not found. Please sign up first." });
      }

      // Step 2: Check if user already has a bank account
      const existingAccount = await Accountholder.findOne({ username });
      if (existingAccount) {
          return res.status(400).json({ error: "User already has a bank account." });
      }

      // Step 3: Generate a unique 10-digit account number
      const accno = Math.floor(1000000000 + Math.random() * 9000000000).toString();

      // Step 4: Create a new bank account using user details
      const newAccount = new Accountholder({
          username,
          accno,
          name: user.name,    // Auto-fetched from User schema
          email: user.email,  // Auto-fetched from User schema
          mobno: user.mobno,  // Auto-fetched from User schema
          balance,
          accountType,
      });

      // Step 5: Save to DB
      await newAccount.save();

      user.bankAccount = newAccount._id;
      await user.save();

      // Step 6: Send response
      res.status(201).json({ message: "Bank account created successfully!", account: newAccount });

  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});











router.post("/adduser", async (req, res) => {
  try {
    const { username,name, email, password, mobno, address } = req.body;
    const user = await User.create({ username,name, email, password, mobno, address });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const users = await User.find().populate("bankAccount");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("bankAccount");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
