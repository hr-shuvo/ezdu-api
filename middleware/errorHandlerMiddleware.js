import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/customError.js";


const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong',
    }

    if (err.name === 'ValidationError') {
        customError.message = Object.values(err.errors).map((item) => item.message).join(',');
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }

    if (err.code && err.code === 11000) {
        customError.message = `Duplicate value entered for ${Object.keys(err.keyValue)}`;
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }

    if (err.name === 'BadRequestError' || err instanceof BadRequestError) {
        customError.statusCode = err.statusCode || StatusCodes.BAD_REQUEST;
        customError.message = err.message;
    }

    return res.status(customError.statusCode).json({ message: customError.message });
};

export default errorHandlerMiddleware;