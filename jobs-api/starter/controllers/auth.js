const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
    // by let database create, if fail create, it will back err message, so we can judge with this error message.
    const user = await User.create({...req.body})
    if (!user) throw new Error()
    const userJSON = user.toJSON()
    const token = user.createdJWT()
    res.status(StatusCodes.CREATED).json({ userJSON, token })
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) throw new BadRequestError('Please provide email, and password')

    const user = await User.findOne({email})
    if (!user) throw new UnauthenticatedError('Invalid Credentials') 

    // compare password
    const result = await user.compare(password)
    if (!result) throw new UnauthenticatedError('Invalid Credentials')  

    const userJSON = user.toJSON()
    const token = user.createdJWT()

    res.status(StatusCodes.OK).json({ userJSON, token })
}

module.exports = {
    register, login
}