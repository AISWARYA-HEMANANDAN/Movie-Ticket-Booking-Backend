const express = require('express')
const { paymentFunction } = require('../controllers/paymentController')
const authMiddleware = require('../middlewares/authMiddleware')
const paymentRoutes = express.Router()

paymentRoutes.post("/stripe-checkout", authMiddleware, paymentFunction)

module.exports = paymentRoutes