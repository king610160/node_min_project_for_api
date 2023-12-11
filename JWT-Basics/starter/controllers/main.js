const CustomError = require('../errors/custom-error')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        throw new CustomError('Please enter username and password', 400)
    }

    // just pass random id
    const id = new Date().getDate()
    const token = jwt.sign({id, username}, process.env.JWT_SECRET, {expiresIn:'30d'})

    res.status(200).json({msg:`User created!`, token})
}

const dashboard = async (req, res) => {
    const authHeader = req.headers.authorization
    let decoded
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new CustomError('No token, no permission', 401)
    }
    // take space's back string for compare
    const token = authHeader.split(' ')[1]

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch(error) {
        throw new CustomError('No authority to access this route', 401)
    }

    const luckyNumber = Math.floor(Math.random() * 100)
    res.status(200).json({msg: `Hello, ${decoded.username}!!!`, secret:`Here is your authority data. Lucky Number is ${luckyNumber}`})
}

module.exports = {
    login,
    dashboard
}