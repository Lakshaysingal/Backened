const { Ticket } = require("../models");

exports.getMyTickets = async(req,res)=>{

try{

const tickets = await Ticket.findAll({
where:{UserId:req.user.id}
});

res.json(tickets);

}
catch(err){

console.log(err);
res.status(500).json({msg:"Server error"});

}

};