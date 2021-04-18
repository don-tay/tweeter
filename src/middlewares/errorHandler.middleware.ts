import { ErrorResponse } from '../utilities';

export const errorHandler = (err, req, res, next) => {
    // Log to console for dev
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack.red);
        // console.error(err);
    }

    let error = { ...err };
    error.message = err.message;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose input validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
            .map((e: Error) => e.message)
            .join('. ');
        error = new ErrorResponse(message, 400);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || `Server Error`,
    });
};
