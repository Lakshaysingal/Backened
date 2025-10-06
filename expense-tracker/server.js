const express= require('express');
const connectdb=require('./db');
const cors=require('cors');
const api=require('./routes/expenseroutes');


const app=express();

app.use(cors());
app.use(express.json());

connectdb();



const PORT=5000;

app.use('/expenses',api);


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
