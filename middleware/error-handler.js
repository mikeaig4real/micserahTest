const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customErr = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  }

  if (err.name === 'ValidationError') {
    customErr.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')
    customErr.statusCode = 400
  }
  if (err.code && err.code === 11000) {
    customErr.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`
    customErr.statusCode = 400
  }
  if (err.name === 'CastError') {
    customErr.msg = `No item found with id : ${err.value}`
    customErr.statusCode = 404
  }
  return res.status(customErr.statusCode).json({ msg: customErr.msg });
}

module.exports = errorHandlerMiddleware
