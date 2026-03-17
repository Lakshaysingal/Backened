const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Seat = sequelize.define("Seat",{

seat_number:DataTypes.STRING,

status:{
type:DataTypes.ENUM("available","booked"),
defaultValue:"available"
}

});

module.exports = Seat;