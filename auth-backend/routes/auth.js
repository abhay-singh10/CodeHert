const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create
        const newUser = new User({
            first_name,
            last_name,
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { loginInput, password } = req.body;
        console.log('Login attempt:', loginInput);
        // Find user by email or username
        const user = await User.findOne({
            $or: [{ email: loginInput }, { username: loginInput }],
        });
        console.log('Found user:', user);
        if (!user) {
            return res.status(400).json({ message: 'Invalid username/email or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        user.token = token;
        user.password = undefined;

        res.status(200).json({
            message: 'Login successful',
            user,
        });



    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
