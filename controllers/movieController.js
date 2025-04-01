const Movie = require("../model/movieModel")
const mongoose = require("mongoose")

// Create movie
const createMovie = async (req, res) => {
    try {
        const { title, description, posterImg, rating, genre, duration } = req.body
        const newMovie = new Movie({ title, description, posterImg, rating, genre, duration })
        const savedMovie = await newMovie.save()
        return res.status(201).json({ message: "Movie created successfully", savedMovie })
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Internal server error" })
    }
}

const addCelebToMovie = async (req, res) => {
    try {
        const { movieId, celebType, celebName, celebRole, celebImage } = req.body
        const movie = await Movie.findById(movieId)
        if (!movie) {
            return res.status(404).json({ error: "Movie not found" })
        }
        const newCeleb = { celebType, celebName, celebRole, celebImage }

        if (celebType === "cast") {
            movie.cast.push(newCeleb)
        } else {
            movie.crew.push(newCeleb)
        }
        await movie.save()
        return res.status(201).json({ message: "Celeb added successfully" })
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
        const updatedMovie = await Movie.findByIdAndUpdate(movieId, req.body, { new: true })
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

module.exports = { createMovie, addCelebToMovie, getAllMovies, getMovie, updateMovie, deleteMovie }