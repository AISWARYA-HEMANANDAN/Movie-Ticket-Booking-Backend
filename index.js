const express = require('express')
const dbConnection = require('./config/dbConnection')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const movieRoutes = require('./routes/movieRoutes')
const screenRoutes = require('./routes/screenRoutes')
const adminRoutes = require('./routes/adminRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
require('dotenv').config()

const app = express()

app.get("/", (req, res) => {
    res.status(200).json("Server started")
    })

//connect Db
dbConnection()

//middleware
app.use(express.json())

app.use(cookieParser())

app.use(cors({
    origin: "https://movie-ticket-booking-frontend-pink.vercel.app"
}))

//routes
app.use("/user", userRoutes)
app.use("/booking", bookingRoutes)
app.use("/movie", movieRoutes)
app.use("/screen", screenRoutes)
app.use("/payment", paymentRoutes)
app.use("/admin", adminRoutes )

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err);

    } else {
        console.log(`Server starts on port ${process.env.PORT}`);
    }

})