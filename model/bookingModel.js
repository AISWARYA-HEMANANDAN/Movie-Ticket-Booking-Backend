const mongoose = require('mongoose')
const bookingSchema = new mongoose.Schema({
    showTime: {
        type: String,
        required: true
    },
    showDate: {
        type: Date,
        required: true
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie', // Reference to the Movie model
        required: true
    },
    screenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Screen', // Reference to the Screen model
        required: true
    },
    seats: [
        {
            // { row: 'D', col: 0, screenId: '10', price: 300 }
            row: {
                type: String,
                required: true
            },
            col: {
                type: Number,
                required: true
            },
            screenId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Screen', // Reference to the Screen model
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    paymentType: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    }
}, { timestamps: true })

bookingSchema.methods.calculateTotalPrice = function () {
    this.totalPrice = this.seats.reduce((total, seat) => total + seat.price, 0)
}

const Booking = new mongoose.model("Booking", bookingSchema)
module.exports = Booking