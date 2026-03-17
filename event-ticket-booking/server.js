require("dotenv").config();

const app = require("./app");

const { sequelize } = require("./models");

sequelize.sync().then(()=>{


app.get('/', (req, res) => {
  res.status(200).json({ message: 'Event Ticket Booking API is running' });
});

app.listen(process.env.PORT,()=>{

console.log("Server running on port",process.env.PORT);

});

});