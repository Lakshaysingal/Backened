const { Event, Seat } = require("../models");

exports.createEvent = async(req,res)=>{

const {title,location,date,price,total_seats} = req.body;

const event = await Event.create({
title,location,date,price,total_seats
});

for(let i=1;i<=total_seats;i++){

await Seat.create({
seat_number:`S${i}`,
EventId:event.id
});

}

res.json(event);

};

exports.getEvents = async(req,res)=>{

const events = await Event.findAll();

res.json(events);

};