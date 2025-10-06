const mongoose=require('mongoose');


const expenseSchema=new mongoose.Schema({
    type:{type:String,required:true},
    category:{type:String,enum: ["income", "expense"],required:true},
    amount:{type:Number,required:true},
    date:{type:Date,required:true},
    description:{type:String,required:true},        
    createdAt:{type:Date,default:Date.now}




});

module.exports=mongoose.model('Expense',expenseSchema);
