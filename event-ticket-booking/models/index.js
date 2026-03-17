const sequelize = require("../config/db");

const User = require("./User");
const Event = require("./Event");
const Seat = require("./Seat");
const Booking = require("./Booking");
const Ticket = require("./Ticket");

/* USER RELATIONS */

User.hasMany(Booking);
Booking.belongsTo(User);

User.hasMany(Ticket);
Ticket.belongsTo(User);

/* EVENT RELATIONS */

Event.hasMany(Seat);
Seat.belongsTo(Event);

Event.hasMany(Booking);
Booking.belongsTo(Event);

Event.hasMany(Ticket);
Ticket.belongsTo(Event);

/* BOOKING RELATIONS */

Booking.hasMany(Ticket);
Ticket.belongsTo(Booking);

module.exports = {
sequelize,
User,
Event,
Seat,
Booking,
Ticket
};