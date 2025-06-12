const Booking = require("../model/bookingModel");
const User = require("../model/userModel");
const Screen = require("../model/screenModel");
const mongoose = require("mongoose");

// Create booking
const createBooking = async (req, res) => {
    try {
        const { showTime, showDate, movieId, screenId, seats, totalPrice } = req.body;
        console.log(req.body);

        const screen = await Screen.findById(screenId);
        if (!screen) {
            return res.status(404).json({ message: "Theatre not found" });
        }
        console.log("Searching for movie schedule with:");
        console.log("Target showDate:", new Date(showDate).toDateString());
        console.log("Target showTime:", showTime.trim());
        console.log("Target movieId:", movieId.toString());

        console.log("Existing schedules:");
        screen.movieSchedules.forEach(schedule => {
            console.log({
                scheduleShowDate: new Date(schedule.showDate).toDateString(),
                scheduleShowTime: schedule.showTime.trim(),
                scheduleMovieId: schedule.movieId.toString(),
            });
        });

        const movieSchedule = screen.movieSchedules.find(schedule => {
            const scheduleDate = new Date(schedule.showDate).toDateString();
            const targetDate = new Date(showDate).toDateString();

            return (
                scheduleDate === targetDate &&
                schedule.showTime.trim().toLowerCase() === showTime.trim().toLowerCase() &&
                schedule.movieId.toString() === movieId.toString()
            );
        });


        if (!movieSchedule) {
            return res.status(404).json({ message: "Movie schedule not found" });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 🛡️ Seat Lock Check
        const alreadyBookedSeats = seats.filter(seat => movieSchedule.notAvailableSeats.includes(seat));
        if (alreadyBookedSeats.length > 0) {
            return res.status(409).json({ message: "Some seats are already booked", alreadyBookedSeats });
        }

        // ✅ All requested seats are available
        const newBooking = new Booking({
            userId: req.userId,
            showTime,
            showDate,
            movieId,
            screenId,
            seats,
            totalPrice
        });
        await newBooking.save();
        console.log('New booking created');

        // 🧹 Mark seats as booked
        movieSchedule.notAvailableSeats.push(...seats);
        await screen.save();
        console.log('Screen updated');

        newBooking.calculateTotalPrice();
        await newBooking.save();

        user.bookings.push(newBooking._id);
        await user.save();
        console.log('User updated');

        return res.status(201).json({ message: "Confirming your seats...", booking: newBooking });
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Internal server error" });
    }
};

// Fetch bookings
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'name email')
            .populate('movieId', 'title');

        console.log(bookings)
        return res.status(200).json({ message: "Bookings fetched successfully", bookings });

    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Internal server error" });
    }
};

// Update booking
const updateBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ error: "Invalid booking id" });
        }
        const updatedBooking = await Booking.findByIdAndUpdate(bookingId, req.body, { new: true });
        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        updatedBooking.calculateTotalPrice();
        await updatedBooking.save();
        return res.status(200).json({ message: "Booking updated successfully", updatedBooking });
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Internal server error" });
    }
};

// Delete booking
const deleteBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ error: "Invalid booking id" });
        }
        const deletedBooking = await Booking.findByIdAndDelete(bookingId);
        if (!deletedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        return res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Internal server error" });
    }
};

module.exports = { createBooking, getBookings, updateBooking, deleteBooking };
