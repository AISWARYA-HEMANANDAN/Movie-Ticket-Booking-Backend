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
      const { screenId, movieId, showTime, showDate } = req.body;
  
      const screen = await Screen.findById(screenId);
      if (!screen) {
        return res.status(404).json({ error: "Screen not found" });
      }
  
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }
  
      // Ensure showDate is saved as YYYY-MM-DD string
      const formattedDate = new Date(showDate).toISOString().slice(0, 10);
  
      screen.movieSchedules.push({
        movieId,
        showTime,
        showDate: formattedDate,
        notavailableseats: []
      });
  
      await screen.save();
      return res.status(201).json({ message: "Movie schedule added successfully" });
  
    } catch (error) {
      console.log(error);
      res.status(error.code || 500).json({ error: error.message || "Internal server error" });
    }
  };
  

// Fetch screens
const getScreens = async (req, res) => {
    try {
        const { movieId, showDate, showTime } = req.query;

        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).json({ error: "Invalid movie ID" });
        }

        const screen = await Screen.findOne({
            movieSchedules: {
                $elemMatch: {
                    movieId: new mongoose.Types.ObjectId(movieId),
                    showDate,
                    showTime
                }
            }
        });

        if (!screen) {
            return res.status(404).json({ error: "No screen available" });
        }

        return res.status(200).json({ message: "Screen fetched successfully", screen });
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({ error: error.message || "Internal server error" });
    }
};

const getAllScreens = async (req, res) => {
    try {
        const screens = await Screen.find().populate("movieSchedules.movieId");
        return res.status(200).json({ screens });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to fetch screens" });
    }
};

const getScreenById = async (req, res) => {
    try {
      const { screenId } = req.params;
      const screen = await Screen.findById(screenId).populate("movieSchedules.movieId");
  
      if (!screen) {
        return res.status(404).json({ error: "Screen not found" });
      }
  
      return res.status(200).json({ screen });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to fetch screen" });
    }
  };
  


// Update screen
const updateScreen = async (req, res) => {
    try {
        const { screenId } = req.params
        if (!mongoose.Types.ObjectId.isValid(screenId)) {
            return res.status(400).json({ error: "Invalid screen ID" });
          }
          
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

module.exports = { createScreen, addMovieScheduleToScreen, getScreens, getAllScreens, getScreenById, updateScreen, deleteScreen }