const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth",require("./routes/authRoutes"));
app.use("/tickets",require("./routes/ticketRoutes"));
app.use("/events",require("./routes/eventRoutes"));
app.use("/booking",require("./routes/bookingRoutes"));
app.use("/payment",require("./routes/paymentRoutes"));
app.use("/admin",require("./routes/adminRoutes"));

module.exports = app;