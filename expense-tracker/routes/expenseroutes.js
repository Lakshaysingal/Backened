const express= require('express');
const {addExpense,getExpenses,deleteExpense,updateExpense}=require('../controllers/expensecontollers');
const router=express.Router();

router.post('/add',addExpense);
router.get('/get',getExpenses);
router.delete('/delete/:id',deleteExpense);
router.put('/update/:id',updateExpense);


module.exports=router;
