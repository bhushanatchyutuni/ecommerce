const express = require('express');
const app = express();
const bodyParser=require('body-parser');
// Adjust the path accordingly
app.use(bodyParser.urlencoded({ extended: true }));
const mongoose=require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/ecommercedb").then(() => {
    console.log('Mongo Db connected');
}).catch((error) => {
    console.log('Failed to connect:', error);
});

// const templatepath = path.join(__dirname, '../templates');
app.use(express.json());
app.use(express.static(__dirname+"/public"));
const signup=require('./src/mongodb');
const signin=require("./src/mongodb")

// Serve the index.html file when the root URL is accessed
app.get("/", (req, res) => {
    res.sendFile(__dirname+"/index.html");
});
// Handle sign-in form submission
app.post("/signin", async (req, res) => {
    try {
        // Check if the provided username and password match a record in the database
        const {Username,Password}=req.body;
        const isUserRegistered=await signup.signup.findOne({Username});
        if (!!isUserRegistered) {
              const isPasswordTrue=isUserRegistered.Password===Password;
              if(isPasswordTrue){
                res.send("Login Success")

              }
              else{
                res.send("Wrong Password !!")
              }
        }
        else{
            res.send("Please Register !!!")
        }
    } 
    catch (error) {
        console.error("Error during sign-in:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Handle sign-up form submission
// Handle sign-up form submission
app.post('/signup', async (req, res) => {
    try {
        // Create a new user based on the signup schema
        const newuser = new signup.signup({
            Username: req.body.Username,
            email: req.body.email,
            Password: req.body.Password
        });
        const {Username}=req.body;
        // Save the new user to the database
        const isUserAlreadyExists=await signup.signup.findOne({Username});
        if(!!isUserAlreadyExists){
            res.send("UserName Already Exits")
        }
        else{
            await newuser.save();
            console.log("User registered successfully");
            // Redirect to the signin page after successful signup
            res.redirect("/");
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            console.error("Validation Error:", error.errors);
            res.status(400).send(error.errors);
        } else {
            console.error("Error during sign-up:", error);
            res.status(500).send("Internal Server Error");
        }
    }
});

app.listen(3000, () => {
    console.log('Port connected on 3000');
}).on('error', (err) => {
    console.error('Error starting server:', err.message);
});
