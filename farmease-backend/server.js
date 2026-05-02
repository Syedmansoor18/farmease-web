const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User'); // Import the blueprint we created

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Database Connection
// Ensure your .env file has MONGO_URI=mongodb://localhost:27017/farmeaseDB
// or your MongoDB Atlas link
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/farmeaseDB')
    .then(() => console.log("✅ Connected to MongoDB Atlas / Compass"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// 2. Simple Test Route
app.get('/', (req, res) => {
    res.send("FarmEase Backend is Running and Connected to DB!");
});

// 3. REAL Signup Route (Saves to Database)
app.post('/api/signup', async (req, res) => {
    try {
        const { fullName, phone, email, password, aadhaar, kisanId, state, district, village, pinCode } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phone }, { aadhaar }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User with this Email, Phone, or Aadhaar already exists." });
        }

        const newUser = new User({
            fullName, phone, email, password, aadhaar, kisanId, state, district, village, pinCode
        });

        await newUser.save();
        res.status(201).json({
            success: true,
            message: "Congratulations! Account created and saved to database."
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// 4. Login Route (Now checks against the Database)
app.post('/api/login', async (req, res) => {
    const { identifier, password } = req.body;

    try {
        // Find user by email OR phone
        const user = await User.findOne({
            $or: [{ email: identifier }, { phone: identifier }]
        });

        if (user && user.password === password) { // Simple check (we will add encryption later)
            res.status(200).json({
                success: true,
                message: "Congratulations for the login! Welcome to FarmEase",
                userName: user.fullName
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Invalid Email/Phone or Password"
            });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Error during login process" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is moving at http://localhost:${PORT}`);
});