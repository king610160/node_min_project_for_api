const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async (req, res, next) => {
    // check
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authetication Invalid.')
    }
    const token = authHeader.split(' ')[1]

    try {
        // in register stage, we sign with userID and name, so we need to attach these info into req.user
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {
            userId: payload.userId,
            name: payload.name
        }
        next()
    } catch(error){
        throw new UnauthenticatedError('Authetication Invalid.')
    }
}

module.exports = auth