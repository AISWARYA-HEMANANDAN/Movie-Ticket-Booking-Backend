const Movie = require("../model/movieModel")
const mongoose = require("mongoose")
const uploadToCloudinary = require("../utilities/imageUpload")

// Create movie
const createMovie = async (req, res) => {
    try {
        const { title, description, rating, genre, duration } = req.body

        if (!title || !description || !rating || !genre || !duration) {
            return res.status(400).json({ error: "All fields are required" })
        }
        if (!req.file) {
            return res.status(400).json({ error: "Image not found" })
        }

        const cloudinaryRes = await uploadToCloudinary(req.file.path)

        const newMovie = new Movie({ title, description, rating, genre, duration, posterImg: cloudinaryRes })
        let savedMovie = await newMovie.save()

        if (savedMovie) {
            return res.status(201).json({ message: "Movie created successfully", savedMovie })
        }
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Internal server error" })
    }
}

// Fetch all movies
const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find()
        return res.status(200).json({ message: "Movies fetched successfully", movies })
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Internal server error" })
    }
}

// Fetch a movie
const getMovie = async (req, res) => {
    try {
        const { movieId } = req.params
        const film = await Movie.findById(movieId)
        if (!film) {
            return res.status(400).json({ error: "Movie not found" })
        }
        return res.status(200).json({ message: "Movie fetched successfully", film })
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Internal server error" })
    }
}

// Update movie
const updateMovie = async (req, res) => {
    try {
        const { movieId } = req.params
        const { title, description, rating, genre, duration } = req.body
        let imageUrl

        let isMovieExist = await Movie.findById(movieId)

        if (!isMovieExist) {
            return res.status(400).json({ error: "Movie Not found" })
        }
        if (req.file) {
            const cloudinaryRes = await uploadToCloudinary(req.file.path)
            imageUrl = cloudinaryRes
        }

        const updatedMovie = await Movie.findByIdAndUpdate(movieId, { title, description, rating, genre, duration, posterImg: imageUrl }, { new: true })
        return res.status(200).json({ message: "Movie updated successfully", updatedMovie })
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Internal server error" })
    }
}

// Delete movie
const deleteMovie = async (req, res) => {
    try {
        const { movieId } = req.params
        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).json({ error: "Invalid movie id" })
        }
        await Movie.findByIdAndDelete(movieId)
        return res.status(200).json({ message: "Movie deleted successfully" })
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Internal server error" })
    }
}

module.exports = { createMovie, getAllMovies, getMovie, updateMovie, deleteMovie }