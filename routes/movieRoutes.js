const express = require('express')
const { createMovie, getAllMovies, getMovie, updateMovie, deleteMovie, addCelebToMovie } = require('../controllers/movieController')
const movieRoutes = express.Router()
const upload = require('../middlewares/multer')

movieRoutes.post("/createmovie", upload.single("posterImg"), createMovie)
movieRoutes.post("/addcelebtomovie",addCelebToMovie)
movieRoutes.get("/getallmovies", getAllMovies)
movieRoutes.get("/getmovie/:movieId", getMovie)
movieRoutes.patch("/updatemovie/:movieId", upload.single('posterImage'), updateMovie)
movieRoutes.delete("/deletemovie/:movieId", deleteMovie)

module.exports = movieRoutes