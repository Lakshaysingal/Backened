const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Event = sequelize.define("Event",{

title:DataTypes.STRING,

location:DataTypes.STRING,

date:DataTypes.DATE,

price:DataTypes.INTEGER,

total_seats:DataTypes.INTEGER

});

module.exports = Event;