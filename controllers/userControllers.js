const User = require("../model/userModel")
const bcrypt = require('bcrypt')
const generateToken = require("../utilities/generateToken")
const mongoose = require("mongoose")

// Register a new user 
const register = async (req, res) => {
    try {
        const { name, email, password, confirmpassword } = req.body
        console.log("Received data:", req.body);

        if (!name || !email || !password || !confirmpassword) {
            return res.status(400).json({ error: 'All fields are required' })
        }

        if (password !== confirmpassword) {
            return res.status(400).json({ error: 'Passwords do not match' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({ name, email, password: hashedPassword })
        const saved = await newUser.save()

        return res.status(201).json({ message: 'User created successfully', saved })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Internal server error" })
    }
}

// Authenticate user 
const login = async (req, res) => {
    try {
        const { role } = req.query
        console.log(role, "role");

        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: 'All fields are required' })
        }

        const existUser = await User.findOne({ email, role })
        if (!existUser) {
            return res.status(400).json({ error: 'User does not exist' })
        }

        const passwordMatch = await bcrypt.compare(password, existUser.password)
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Password does not match' })
        }

        const userObject = existUser.toObject()
        delete userObject.password

        const token = generateToken(existUser._id, role, existUser.name)

        return res.status(200).json({ message: 'Login successful', userObject, token })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Internal server error" })
    }
}

// Fetch a user profile
const fetchUser = async (req, res) => {
    try {
        const userId = req.user
        const user = await User.findById(userId).select("-password")
        return res.status(200).json({ message: 'User fetched successfully', user })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Internal server error" })
    }
}

// Update a user profile
const updateUser = async (req, res) => {
    try {
        const userId = req.user
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true })
        return res.status(200).json({ message: 'User updated successfully', updatedUser })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Internal server error" })
    }
}

// Delete a user profile
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" })
        }
        await User.findByIdAndDelete(userId)
        return res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Internal server error" })
    }
}

// Fetch all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name email isActive createdAt');
        return res.status(200).json({ message: 'Users fetched successfully', users })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Internal server error" })
    }
}

module.exports = { register, login, fetchUser, updateUser, deleteUser, getAllUsers }
