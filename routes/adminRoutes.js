const express = require('express')
const { login } = require('../controllers/userControllers')
const adminRoutes = express.Router()

adminRoutes.post("/admin/login",login )

module.exports = adminRoutes