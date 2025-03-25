const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  accno: { type: String, required: true }, 
  type: { type: String, required: true }, 
  amount: { type: Number, required: true, min: 0 },
  fromAccno: { type: String }, 
  toAccno: { type: String }, 
  merchant: { type: String }, 
  description: { type: String },
  cardNumber: { type: String }, 
  metadata: { type: Object, default: {} }, 
  date: { type: Date, default: Date.now }
});

const transactions = mongoose.model("Transaction", transactionSchema);


module.exports=transactions;
