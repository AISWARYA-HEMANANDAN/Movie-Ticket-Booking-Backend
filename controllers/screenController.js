const Movie = require("../model/movieModel")
const Screen = require("../model/screenModel")
const mongoose = require("mongoose")

// Create screen
const createScreen = async (req, res) => {
    try {
        const { name, location, seats, city, screenType } = req.body
        const newScreen = new Screen({ name, location, seats, city: city.toLowerCase(), screenType, movieSchedules: [] })
        const savedScreen = await newScreen.save();
        return res.status(201).json({ message: "Screen created successfully", savedScreen })
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Internal server error" })
    }
}

const addMovieScheduleToScreen = async (req, res) => {
    try {
        const { screenId, movieId, showTime, showDate } = req.body
        const screen = await Screen.findById(screenId)
        if (!screen) {
            return res.status(404).json({ error: "Screen not found" })
        }

        const movie = await Movie.findById(movieId)
        if (!movie) {
            return res.status(404).json({ error: "Movie not found" })
        }

        screen.movieSchedules.push({ movieId, showTime, notavailableseats: [], showDate })
        await screen.save()
        return res.status(201).json({ message: "Movie schedule added successfully" })
    } catch (error) {
        console.log(error)
        res.status(error.code || 500).json({ error: error.message || "Internal server error" })
    }
}

// Fetch screens
const getScreens = async (req, res) => {
    try {
        const screens = await Screen.find()
        return res.status(200).json({ message: "Screens fetched successfully", screens })
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Internal server error" })
    }
}

// Update screen
const updateScreen = async (req, res) => {
    try {
        const { screenId } = req.params
        const updatedScreen = await Screen.findByIdAndUpdate(screenId, req.body, { new: true })
        return res.status(200).json({ message: "Screen updated successfully", updatedScreen })
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Internal server error" })
    }
}

// Delete screen
const deleteScreen = async (req, res) => {
    try {
        const { screenId } = req.params
        if (!mongoose.Types.ObjectId.isValid(screenId)) {
            return res.status(400).json({ error: "Invalid screen id" })
        }
        await Screen.findByIdAndDelete(screenId)
        return res.status(200).json({ message: "Screen deleted successfully" })
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Internal server error" })
    }
}

module.exports = { createScreen, addMovieScheduleToScreen, getScreens, updateScreen, deleteScreen }