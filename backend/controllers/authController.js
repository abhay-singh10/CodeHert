const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { first_name, last_name, username, email, password } = req.body;

        // Check if user already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ error: 'Username already exists' });
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

        // Convert user to plain object and remove password
        const userObj = newUser.toObject();
        delete userObj.password;

        res.status(201).json({
            message: 'User registered successfully',
            user: userObj
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { loginInput, password } = req.body;
        console.log('Login attempt:', loginInput);
        // Find user by email or username
        const user = await User.findOne({
            $or: [{ email: loginInput }, { username: loginInput }],
        });
        console.log('Found user:', user);
        if (!user) {
            return res.status(400).json({ error: 'Invalid username/email or user does not exist' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Incorrect password' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '6h' }
        );

        // Convert user to plain object and remove password
        const userObj = user.toObject();
        delete userObj.password;

        // Set JWT as HttpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            //samesite: 'lax' for localhost browser
            sameSite: 'none', //for hosting render 
            maxAge: 6 * 60 * 60 * 1000 // 6 hours
        });

        res.status(200).json({
            message: 'Login successful',
            user: userObj,
            token //add token response
        });

    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }

};

// @route   POST /api/auth/logout
exports.logout = async (req, res) => {
    try {
        // Clear the JWT cookie
        res.clearCookie('token', {
            httpOnly: true,
            //sameSite: 'lax',
            sameSite: 'none', //for hosting
            secure: process.env.NODE_ENV === 'production'
        });
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

