const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) throw new BadRequestError('Please provide name, email, password.')

    const result = await User.findOne({name})
    if (result) throw new UnauthenticatedError('This user have registered.')

    const user = await User.create({...req.body})
    const userJSON = user.toJSON()
    const token = user.createdJWT()
    res.status(StatusCodes.CREATED).json({ userJSON, token })
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) throw new BadRequestError('Please provide email, password.')

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