const { Seat } = require("../models");

exports.getSeats = async(req,res)=>{

const seats = await Seat.findAll({
where:{EventId:req.params.eventId}
});

res.json(seats);

};