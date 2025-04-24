const Booking = require("../model/bookingModel")
const User = require("../model/userModel")
const Screen = require("../model/screenModel")
const mongoose = require("mongoose")

// Create booking
const createBooking = async (req, res) => {
    try {
        const { showTime, showDate, movieId, screenId, seats, totalPrice } = req.body
        console.log(req.body);

        const screen = await Screen.findById(screenId);
        if (!screen) {
            return res.status(404).json({ message: "Theatre not found" });
        }
        const movieSchedule = screen.movieSchedules.find(schedule => {
            const scheduleDate = new Date(schedule.showDate).toDateString();
            const targetDate = new Date(showDate).toDateString();
        
            return (
                scheduleDate === targetDate &&
                schedule.showTime === showTime &&
                String(schedule.movieId) === String(movieId)
            );
        });

        if (!movieSchedule) {
            return res.status(404).json({ message: "Movie schedule not found" });
        }
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log('before newBooking done');
        const newBooking = new Booking({ userId: req.userId, showTime, showDate, movieId, screenId, seats, totalPrice })
        await newBooking.save();
        console.log('newBooking done');

        movieSchedule.notAvailableSeats.push(...seats);
        await screen.save();
        console.log('screen saved');

        newBooking.calculateTotalPrice()

        user.bookings.push(newBooking._id);
        const savedBooking = await user.save();
        console.log('user saved');
        return res.status(201).json({ message: "Booking created successfully", savedBooking })
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Internal server error" })
    }
}

// Fetch bookings
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
        return res.status(200).json({ message: "Bookings fetched successfully", bookings })
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Internal server error" })
    }
}

// Update booking
const updateBooking = async (req, res) => {
    try {
        const { bookingId } = req.params
        const updatedBooking = await Booking.findByIdAndUpdate(bookingId, req.body, { new: true })
        updatedBooking.calculateTotalPrice()
        return res.status(200).json({ message: "Booking updated successfully", updatedBooking })
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Internal server error" })
    }
}

// Delete booking
const deleteBooking = async (req, res) => {
    try {
        const { bookingId } = req.params
        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ error: "Invalid booking id" })
        }
        const deletedBooking = await Booking.findByIdAndDelete(bookingId)
        deletedBooking.calculateTotalPrice()
        return res.status(200).json({ message: "Booking deleted successfully" })
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Internal server error" })
    }
}

module.exports = { createBooking, getBookings, updateBooking, deleteBooking }