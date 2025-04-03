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
        type: [String], // You can store multiple genres as an array of strings
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    cast: [
        {
            celebType : String,
            celebName : String,
            celebRole : String,
            celebImage : String
        }
    ],
    crew: [
        {
            celebType : String,
            celebName : String,
            celebRole : String,
            celebImage : String
        }
    ]    
}, { timeStamps: true })

const Movie = new mongoose.model("Movie", movieSchema)
module.exports = Movie