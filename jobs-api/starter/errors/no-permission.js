const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');

class NoPermissionError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = NoPermissionError;