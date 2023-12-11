const CustomError = require('../errors/custom-error')
const jwt = require('jsonwebtoken')

const auth = async(req, res, next) => {
    const authHeader = req.headers.authorization
    let decoded
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new CustomError('No token, no permission', 401)
    }
    // take space's back string for compare
    const token = authHeader.split(' ')[1]

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
        const { id, username } = decoded
        console.log(decoded)
        req.user = { id, username }
        next()
    } catch(error) {
        throw new CustomError('No authority to access this route', 401)
    }

   
}

module.exports = auth

