const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Ticket = sequelize.define("Ticket",{

ticket_number:{
type:DataTypes.STRING
},

qr_code:{
type:DataTypes.TEXT
},
seat_number:{
    type:DataTypes.STRING
}

});

module.exports = Ticket;