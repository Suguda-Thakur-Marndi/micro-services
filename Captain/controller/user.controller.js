const userModel = require('../model/captain.model');
const BlacklistToken = require('../model/blacklistToken');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "name, email and password are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "password must be at least 6 characters" });
        }

        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token);
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "email and password are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const bearerToken = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : null;
        const token = req.cookies.token || bearerToken;
        if (!token) {
            return res.status(400).json({ message: "No token provided" });
        }

        await BlacklistToken.findOneAndUpdate(
            { token },
            { token, createdAt: new Date() },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.clearCookie('token');
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
module.exports.updateProfile = async (req, res) => {
    try {
        const { name, email, isAvailble, isAvailable } = req.body;
        const resolvedAvailability = isAvailable !== undefined ? isAvailable : isAvailble;

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (resolvedAvailability !== undefined) updateData.isAvailble = resolvedAvailability;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No valid fields provided for update" });
        }

        const captain = await userModel.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!captain) {
            return res.status(404).json({ message: "Captain not found" });
        }

        res.status(200).json({ captain });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};