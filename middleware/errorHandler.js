const ErrorHandler = (err, req, res, next)=> {
    let error = {...err}
    error.message = err.message
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message
    })
}

module.exports = ErrorHandler