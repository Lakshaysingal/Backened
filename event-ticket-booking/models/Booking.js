const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Booking = sequelize.define("Booking",{

status:{
type:DataTypes.ENUM("pending","confirmed"),
defaultValue:"pending"
},

qr_code:DataTypes.TEXT

});

module.exports = Booking;