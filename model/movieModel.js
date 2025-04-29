const mongoose = require('mongoose')
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    posterImg: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    genre: {
        type: [String],
        required: true
    },
    duration: {
        type: String,
        required: true
    },

}, { timestamps: true })

const Movie = new mongoose.model("Movie", movieSchema)
module.exports = Movie