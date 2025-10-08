const express= require('express');
const {addExpense,getExpenses,deleteExpense,updateExpense,getTotalExpenses,getBalanceSummary,getExpensebycategory}=require('../controllers/expensecontollers');
const router=express.Router();

router.post('/add',addExpense);
router.get('/get',getExpenses);
router.delete('/delete/:id',deleteExpense);
router.put('/update/:id',updateExpense);
router.get('/totalexpenses',getTotalExpenses);
router.get('/balancesummary',getBalanceSummary);
router.get('/expensebycategory',getExpensebycategory);



module.exports=router;
