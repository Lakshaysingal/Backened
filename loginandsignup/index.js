const express=require('express');
const mongoose=require('mongoose');
const bodparser=require('body-parser');

const app=express();

app.use(bodparser.json());

mongoose.connect('mongodb://localhost:27017/signup',{})

.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const person=new mongoose.Schema({
    username: { type: String, required: true },
     password: { type: String, required: true },

});

const Person = mongoose.model('Person', person);

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    const newPerson = new Person({ username, password});

    try {
        const savedPerson = await newPerson.save();
        res.status(201).json(savedPerson);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



app.listen(5000, () => {
    console.log(`Server is running on port ${5000}`);
});









// mongodb://localhost:27017