const usermodel = require('../model/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
module.exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await usermodel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new usermodel({
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
}