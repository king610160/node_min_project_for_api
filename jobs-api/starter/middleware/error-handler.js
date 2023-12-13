const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again later.'
  }

  if (err.name === 'ValidationError'){
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ')
    customError.statusCode = 400
  }

  if (err.name === 'CastError'){
    customError.msg = `The id ${err.value}'s job does not exist.`
    customError.statusCode = 404
  }

  // if mongodb has the data already, it will go to this error
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value.`
    customError.statusCode = 400
  }

  // return res.status(customError.statusCode).json({ err: err })
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
