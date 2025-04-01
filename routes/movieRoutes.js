const express = require('express')
const { createMovie, getAllMovies, getMovie, updateMovie, deleteMovie, addCelebToMovie } = require('../controllers/movieController')
const movieRoutes = express.Router()

movieRoutes.post("/createmovie", createMovie)
movieRoutes.post("/addcelebtomovie",addCelebToMovie)
movieRoutes.get("/getallmovies", getAllMovies)
movieRoutes.get("/getmovie/:movieId", getMovie)
movieRoutes.patch("/updatemovie/:movieId", updateMovie)
movieRoutes.delete("/deletemovie/:movieId", deleteMovie)

module.exports = movieRoutes