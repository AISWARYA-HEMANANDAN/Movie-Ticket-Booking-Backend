const jwt = require('jsonwebtoken')

const userModel = require('../model/userModel')

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        console.log(authHeader, "header");

        const authToken = authHeader && authHeader.split(" ")[1];
        // If there is no token
        if (!authToken) return res.json({ status: false, message: "No auth token" });

        //Decording the token
        const decoded = jwt.verify(authToken, process.env.JWT_SECRETE)
        
        //Checking whether the user is exist or not
        const user = await userModel.findOne({ _id: decoded.id })
        if (!user) return res.json({ status: false, message: "User not Found" })
        req.user = decoded.id

        next()
    } catch (error) {
        return res.json({ loginfail: true, status: false, message: "Please Login" })
    }
}