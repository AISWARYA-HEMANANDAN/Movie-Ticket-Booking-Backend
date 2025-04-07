const Booking = require("../model/bookingModel")
const User = require("../model/userModel")
const Screen = require("../model/screenModel")
const mongoose = require("mongoose")

// Create booking
const createBooking = async (req, res) => {
    try {
        const { showTime, showDate, movieId, screenId, seats, totalPrice, paymentId, paymentType } = req.body
        console.log(req.body);

        // You can create a function to verify payment id
        const screen = await Screen.findById(screenId);
        if (!screen) {
            return res.status(404).json({ message: "Theatre not found" });
        }
        const movieSchedule = screen.movieSchedules.find(schedule => {
            console.log(schedule);
            let showDate1 = new Date(schedule.showDate);
            let showDate2 = new Date(showDate);
            if (showDate1.getDate() === showDate2.getDate() &&
                showDate1.getMonth() === showDate2.getMonth() &&
                showDate1.getFullYear() === showDate2.getFullYear() &&
                schedule.showTime === showTime &&
                schedule.movieId == movieId) {
                return true;
            }
            return false;
        });

        if (!movieSchedule) {
            return res.status(404).json({ message: "Movie schedule not found" });
        }
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log('before newBooking done');
        const newBooking = new Booking({ userId: req.userId, showTime, showDate, movieId, screenId, seats, totalPrice, paymentId, paymentType })
        await newBooking.save();
        console.log('newBooking done');

        movieSchedule.notAvailableSeats.push(...seats);
        await screen.save();
        console.log('screen saved');

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
        await Booking.findByIdAndDelete(bookingId)
        return res.status(200).json({ message: "Booking deleted successfully" })
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Internal server error" })
    }
}

module.exports = { createBooking, getBookings, updateBooking, deleteBooking }