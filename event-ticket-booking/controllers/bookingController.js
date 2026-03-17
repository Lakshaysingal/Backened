const { Seat,Event, Booking,Ticket } = require("../models");

exports.bookSeats = async(req,res)=>{

const {eventId,seats} = req.body;

const userId = req.user.id;

/* CHECK SEATS */

for(let seatId of seats){

const seat = await Seat.findByPk(seatId);

if(!seat){
return res.json({msg:"Seat not found"});
}

if(seat.status === "booked"){
return res.json({msg:"Seat already booked"});
}

}

/* CREATE BOOKING */

const booking = await Booking.create({
UserId:userId,
EventId:eventId
});

/* LOCK SEATS */

for(let seatId of seats){

const seat = await Seat.findByPk(seatId);

seat.status="booked";

await seat.save();

}

res.json({
msg:"Seats reserved. Complete payment.",
bookingId:booking.id
});

};

exports.getMyBookings = async(req,res)=>{

try{

const bookings = await Booking.findAll({

where:{ UserId:req.user.id },

include:[
{
model:Event,
attributes:["title","location","date","price"]
},
{
model:Ticket,
attributes:["seat_number","ticket_number"]
}
]

});

res.json(bookings);

}
catch(err){

console.log(err);
res.status(500).json({msg:"Server error"});

}

};