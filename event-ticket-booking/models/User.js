const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User",{

name:DataTypes.STRING,

email:{
type:DataTypes.STRING,
unique:true
},

password:DataTypes.STRING,

role:{
type:DataTypes.ENUM("admin","organizer","user"),
defaultValue:"user"
}

});

module.exports = User;