const User = require("../model/userModel")
const bcrypt = require('bcrypt')
const generateToken = require("../utilities/generateToken")
const mongoose = require("mongoose")

// Register a new user 
const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, city } = req.body
        if (!name || !email || !password || !confirmPassword || !city) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        if (password!==confirmPassword) {
            return res.status(400).json({ error: 'Passwords are not matched' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({ name, email, password: hashedPassword, city })
        const saved = await newUser.save()
        return res.status(201).json({ message: 'User created successfully', saved })

    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Internal server error" })
    }
}

// Authenticate user 
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const existUser = await User.findOne({ email })
        if (!existUser) {
            return res.status(400).json("User does not exist")
        }

        const passwordMatch = await bcrypt.compare(password, existUser.password)
        if (!passwordMatch) {
            return res.status(400).json("Password does not match")
        }

        const userObject = existUser.toObject()
        delete userObject.password

        const token = generateToken(existUser._id)

        return res.status(200).json({ message: 'Login successfull', userObject, token })

    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Internal server error" })
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
        res.status(error.code || 500).json({ error: error.message || "Internal server error" })
    }
}

// Update a user profile
const updateUser = async (req, res) => {
    try {
        const userId = req.user
        const updatedUsers = await User.findByIdAndUpdate(userId, req.body, { new: true })
        return res.status(200).json({ message: 'User updated successfully', updatedUsers })
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Internal server error" })
    }
}

// Delete a user profile
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user id" })
        }
        await User.findByIdAndDelete(userId)
        return res.status(200).json("User deleted")
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}

module.exports = { register, login, fetchUser, updateUser, deleteUser }