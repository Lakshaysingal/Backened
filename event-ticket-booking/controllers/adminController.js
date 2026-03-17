const { User, Event } = require("../models");

exports.dashboard = async(req,res)=>{

const totalUsers = await User.count({
where:{role:"user"}
});

const totalEvents = await Event.count();

res.json({
totalUsers,
totalEvents
});

};