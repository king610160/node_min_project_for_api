
const express = require('express')
const router = express.Router()

const { login, dashboard } = require('../controllers/main')
const authticated = require('../middleware/auth')

router.route('/dashboard').get(authticated,dashboard)
router.route('/login').post(login)

module.exports = router