const express = require('express')
const { createMovie, getAllMovies, getMovie, updateMovie, deleteMovie } = require('../controllers/movieController')
const movieRoutes = express.Router()
const upload = require('../middlewares/multer')

movieRoutes.post("/createmovie", upload.single("posterImg"), createMovie)
movieRoutes.get("/getallmovies", getAllMovies)
movieRoutes.get("/getmovie/:id", getMovie)
movieRoutes.patch("/updatemovie/:movieId", upload.single('posterImage'), updateMovie)
movieRoutes.delete("/deletemovie/:movieId", deleteMovie)

module.exports = movieRoutes