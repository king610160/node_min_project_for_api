const { UnAuthticatedError } = require('../errors')
const jwt = require('jsonwebtoken')

const auth = async(req, res, next) => {
    const authHeader = req.headers.authorization
    let decoded
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnAuthticatedError('No token, no permission')
    }
    // take space's back string for compare
    const token = authHeader.split(' ')[1]

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
        const { id, username } = decoded
        req.user = { id, username }
        next()
    } catch(error) {
        throw new UnAuthticatedError('No authority to access this route')
    }

   
}

module.exports = auth

