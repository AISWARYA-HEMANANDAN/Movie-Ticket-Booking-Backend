const express = require('express')
const { createBooking, getBookings, updateBooking, deleteBooking } = require('../controllers/bookingController')
const bookingRoutes = express.Router()

bookingRoutes.post("/createbooking", createBooking)
bookingRoutes.get("/getbookings", getBookings)
bookingRoutes.patch("/updatebooking/:bookingId", updateBooking)
bookingRoutes.delete("/deletebooking/:bookingId", deleteBooking)

module.exports = bookingRoutes