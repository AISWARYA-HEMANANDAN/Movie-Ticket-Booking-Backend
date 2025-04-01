const express = require('express')
const { register, login, fetchUser, updateUser, deleteUser } = require('../controllers/userControllers')
const authMiddleware = require('../middlewares/authMiddleware')
const userRoutes = express.Router()

userRoutes.post("/register", register)
userRoutes.post("/login", login)
userRoutes.get("/fetchuser", authMiddleware, fetchUser)
userRoutes.patch("/updateuser", authMiddleware, updateUser)
userRoutes.delete("/deleteuser/:userId", deleteUser)

module.exports = userRoutes