const Expense=require('../models/expense');


exports.addExpense=async(req,res)=>{
    try{
        const {type,category,amount,date,description}=req.body;
        const expense=new Expense({type,category,amount,date,description});
        await expense.save();
        res.status(201).json({message:"Expense added successfully",expense});

    }
    catch(error){
        res.status(500).json({message:"Server error"});

    }
}


exports.getExpenses=async(req,res)=>{
    try{
        const expenses=await Expense.find().sort({createdAt:-1});
        res.status(200).json(expenses);

    }
    catch(error){
        res.status(500).json({message:"Server error"});

    }
}

exports.deleteExpense=async(req,res)=>{
    try{
        const expenseId=await Expense.findByIdAndDelete(req.params.id);

        res.status(200).json({message:"Expense deleted successfully"});
      


    }
    catch(error){
        res.status(500).json({message:"Server error"});
    }
}


exports.updateExpense=async(req,res)=>{
    try{
        const expenseId=req.params.id;
        const {type,category,amount,date,description}=req.body;
        const expense=await Expense.findByIdAndUpdate(expenseId,{type,category,amount,date,description},{new:true});
        res.status(200).json({message:"Expense updated successfully",expense});
    }
    catch(error){
        res.status(500).json({message:"Server error"});
    }
}




