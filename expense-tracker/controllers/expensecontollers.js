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

exports.getTotalExpenses=async(req,res)=>{ 

    try{
        const totalExpenses=await Expense.aggregate([
                { $match: { category: { $regex: /^Expense$/i } } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ]);
        res.status(200).json({total:totalExpenses[0]?.total || 0});
            }
    catch(error){
        res.status(500).json({message:"Server error"});

    }





}







exports.getExpensebymonth=async(req,res)=>{
    try{

    }

    catch(error){
        res.status(500).json({message:"Server error"});
        console.error(error);
    }

}



exports.getExpensebyyear=async(req,res)=>{
    try{

    }

    catch(error){
        res.status(500).json({message:"Server error"});
        console.error(error);
    }


}


exports.getBalanceSummary=async(req,res)=>{
    try{
        const {month,year}=req.query;
        const now =new Date();
         const targetMonth = month ? parseInt(month) : now.getMonth() + 1; // JS month is 0-based
    const targetYear = year ? parseInt(year) : now.getFullYear();


        const startDate=new Date(targetYear,targetMonth-1,1);
        const endDate=new Date(targetYear,targetMonth,0,23,59,59,999);

        const transactions= await Expense.find({
            date:{ $gte: startDate, $lte: endDate }
        });
        const totalIncome=transactions
            .filter(t=>t.category==="Income")
            .reduce((acc,t)=>acc+t.amount,0);
        const totalExpense=transactions
            .filter(t=>t.category==="Expense")
            .reduce((acc,t)=>acc+t.amount,0);
        const balance=totalIncome-totalExpense;

        res.status(200).json({
        month: targetMonth,
        year: targetYear,
        totalIncome,
        totalExpense,
        balance,
        });
        


    }
    catch(error){
        res.status(500).json({message:"Server error"});
        console.error(error);
    }






}


exports.getExpensebycategory=async(req,res)=>{
    try{
        const {month,year}=req.query;
        const now =new Date();
        const targetMonth = month ? parseInt(month) : now.getMonth() + 1; // JS month is 0-based
        const targetYear = year ? parseInt(year) : now.getFullYear();
        const startDate=new Date(targetYear,targetMonth-1,1);
        const endDate=new Date(targetYear,targetMonth,0,23,59,59,999);
        const expensesByCategory = await Expense.aggregate([
      { 
        $match: { 
          category: "Expense", 
          date: { $gte: startDate, $lte: endDate } 
        } 
      },
      { 
        $group: { 
          _id: "$type",            // group by 'type' field (like food, travel)
          total: { $sum: "$amount" },  // total amount per type
        } 
      },
      { $sort: { total: -1 } }         // sort by highest spending first
    ]);

    res.status(200).json({
      month: targetMonth,
      year: targetYear,
      categories: expensesByCategory
    });
  } 
    catch(error){
        res.status(500).json({message:"Server error"});
        console.error(error);

    }
}







