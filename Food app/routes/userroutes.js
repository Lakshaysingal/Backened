const express =require('express');

const router=express.Router();

const usercontroller=require('../controller/usercontroller');


router.post('/createuser',usercontroller.register);










module.exports=router;
