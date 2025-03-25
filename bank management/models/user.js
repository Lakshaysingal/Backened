
const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, 
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobno: { type: String, unique: true, required: true },
  address: { type: String },
  bankAccount: { type: mongoose.Schema.Types.ObjectId, ref: "BankAccount", default: null }, 
  createdAt: { type: Date, default: Date.now }
});

const user = mongoose.model("User", userSchema);

module.exports=user;
    