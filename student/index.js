const express=require('express');
const mongoose=require('mongoose');

const app=express();

app.use(express.json());



mongoose.connect("mongodb://localhost:27017/students")
  .then(() => console.log("connected"))
  .catch((err) => console.log("error to connect"));

const studentdata=new mongoose.Schema({
    id:{type:Number,required:true,unique: true},
    name:{type:String,required:true},
    email:{type:String,required:true},
    mobno:{type:String,required:true},
    
});


const Student=mongoose.model("STUDENT",studentdata);

app.post("/students",async(req,res)=>{
    try {
        const { id,name, email, mobno } = req.body;
        const newStudent = new Student({ id,name, email, mobno });
        await newStudent.save();
        res.status(201).send("Student added successfully");
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(400).send("Error adding student: " + error.message);
    }
});

app.get("/students",async(req,res)=>{
    try{
        const students=await Student.find();
        res.status(200).json(students);

    }
    catch(error){
        res.status(400).send(error.message);
    }
});



app.get("/students/:id",async(req,res)=>{
    try{
        const studentId = parseInt(req.params.id, 10);
        const student=await Student.findOne({id:studentId});
        if(!student){
            return res.status(404).send("student not found");
        }
        res.status(200).json(student);

    }
    catch(error){
        res.status(400).send(error.message);
    }


});
















app.listen(3000, () => {
    console.log(`Server running on http://localhost:${3000}`);
});


