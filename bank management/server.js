const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const accountRoutes = require("./routes/accountroutes");
// const loanRoutes = require("./routes/loanRoutes");

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use("/accounts", accountRoutes);

app.get("/",async(req,res)=>{
    res.send("Bank Management api");
});
// app.use("/loans", loanRoutes);

app.listen(3000, () => {
    console.log(`Server running on http://localhost:3000`);
});
