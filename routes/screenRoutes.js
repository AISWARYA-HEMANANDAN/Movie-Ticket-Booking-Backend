const express = require('express')
const { createScreen, getScreens, updateScreen, deleteScreen, addMovieScheduleToScreen, getAllScreens, getScreenById } = require('../controllers/screenController')
const screenRoutes = express.Router()

screenRoutes.post("/createscreen", createScreen)
screenRoutes.post("/addmoviescheduletoscreen", addMovieScheduleToScreen)
screenRoutes.get("/getscreens", getScreens)
screenRoutes.get("/getallscreens", getAllScreens)
screenRoutes.get("/getscreenbyid/:screenId", getScreenById)
screenRoutes.patch("/updatescreen/:screenId", updateScreen)
screenRoutes.delete("/deletescreen/:screenId", deleteScreen)

module.exports = screenRoutes