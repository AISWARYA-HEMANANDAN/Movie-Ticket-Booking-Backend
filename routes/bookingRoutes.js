const express = require('express')
const { createBooking, getBookings, updateBooking, deleteBooking } = require('../controllers/bookingController')
const authMiddleware = require('../middlewares/authMiddleware')
const bookingRoutes = express.Router()

bookingRoutes.post("/createbooking", authMiddleware, createBooking)
bookingRoutes.get("/getbookings", authMiddleware, getBookings)
bookingRoutes.patch("/updatebooking/:bookingId", authMiddleware, updateBooking)
bookingRoutes.delete("/deletebooking/:bookingId", authMiddleware, deleteBooking)

module.exports = bookingRoutes