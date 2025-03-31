const User = require("../models/user");
const Accountholder = require("../models/account");



const generateAccountNumber = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString(); 
  };


  
exports.createbankaccount= async (req, res) => {
  try {
      const { username, balance, accountType } = req.body;

      
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(400).json({ error: "User not found. Please sign up first." });
      }

     
      const existingAccount = await Accountholder.findOne({ username });
      if (existingAccount) {
          return res.status(400).json({ error: "User already has a bank account." });
      }

      
      const accno = generateAccountNumber();

      
      const newAccount = new Accountholder({
          username,
          accno,
          name: user.name,    
          email: user.email,  
          mobno: user.mobno, 
          balance,
          accountType,
      });

      
      await newAccount.save();

      user.bankAccount = newAccount._id;
      await user.save();

      
      res.status(201).json({ message: "Bank account created successfully!", account: newAccount });

  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


