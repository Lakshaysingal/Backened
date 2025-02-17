

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB (Replace with your own connection string)
mongoose.connect("mongodb://localhost/studentdb")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error connecting to MongoDB:", err));

// Create a student schema
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    grade: { type: String, required: true },
});

// Create a student model
const Student = mongoose.model("Student", studentSchema);

// Create CRUD routes

// CREATE: Add a new student
app.post("/students", async (req, res) => {
    try {
        const { name, age, grade } = req.body;
        const newStudent = new Student({ name, age, grade });
        await newStudent.save();
        res.status(201).send("Student added");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// READ: Get all students
app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// READ: Get a student by ID
app.get("/students/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).send("Student not found");
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// UPDATE: Update a student's information
app.put("/students/:id", async (req, res) => {
    try {
        const { name, age, grade } = req.body;
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, { name, age, grade }, { new: true });
        if (!updatedStudent) {
            return res.status(404).send("Student not found");
        }
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// DELETE: Delete a student by ID
app.delete("/students/:id", async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) {
            return res.status(404).send("Student not found");
        }
        res.status(200).send("Student deleted");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
