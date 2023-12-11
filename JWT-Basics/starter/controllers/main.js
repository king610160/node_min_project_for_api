const CustomError = require('../errors/custom-error')
const jwt = require('jsonwebtoken')
const { BadRequestError } = require('../errors')

const login = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        throw new BadRequestError('Please enter username and password')
    }

    // just pass random id
    const id = new Date().getDate()
    const token = jwt.sign({id, username}, process.env.JWT_SECRET, {expiresIn:'30d'})

    res.status(200).json({msg:`User created!`, token})
}

const dashboard = async (req, res) => {
    const luckyNumber = Math.floor(Math.random() * 100)
    res.status(200).json({msg: `Hello, ${req.user.username}!!!`, secret:`Here is your authority data. Lucky Number is ${luckyNumber}`})
}

module.exports = {
    login,
    dashboard
}