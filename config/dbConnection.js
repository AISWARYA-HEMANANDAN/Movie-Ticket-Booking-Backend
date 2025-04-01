const mongoose = require('mongoose')
const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Db connection successfull");
    } catch (error) {
        console.log(error);
    }
}
module.exports = dbConnection