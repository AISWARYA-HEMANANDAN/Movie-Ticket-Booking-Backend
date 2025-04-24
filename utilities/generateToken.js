const jwt = require('jsonwebtoken')

const generateToken = (id, role = "user", name) => {
    try {
        const token = jwt.sign({ id: id, role: role, name: name }, process.env.JWT_SECRETE,
            { expiresIn: '1d' })
        return token
    } catch (error) {
        console.log(error);
    }
}
module.exports = generateToken