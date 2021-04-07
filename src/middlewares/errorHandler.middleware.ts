import { ErrorResponse } from '../utilities';

export const errorHandler = (err, req, res, next) => {
    // Log to console for dev
    // console.log(err.stack.red);
    // console.error(`err.name is ${err.name}`.bgRed);
    // console.error(`err.code is ${err.code}`.bgRed);
    // console.error(err);

    let error = { ...err };
    error.message = err.message;

    // Resource not found
    if (err.name === 'QueryResultError') {
        const message = `Resource not found`;
        error = new ErrorResponse(message, 404);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || `Server Error`,
    });
};
