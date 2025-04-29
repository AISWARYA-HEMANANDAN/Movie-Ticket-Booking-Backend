const Stripe = require('stripe')

const stripe = new Stripe(process.env.STRIPE_SECRET)

const paymentFunction = async (req, res) => {
    try {
        const { movies } = req.body

        const lineItems = movies.map((movie) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: movie.title,
                    images: [movie.posterImg]
                },
                unit_amount: Math.round(movie.price * 100),
            },
            quantity: 1
        }))

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/payment/success`,
            cancel_url: `${process.env.FRONTEND_URL}/payment/failed`
        })

        res.status(200).json({
            success: true, sessionId: session.id
        })
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}

module.exports = {
    paymentFunction
}