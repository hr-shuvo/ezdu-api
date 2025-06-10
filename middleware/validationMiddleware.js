import { body, param, validationResult } from "express-validator";
import { BadRequestError, NotFoundError, UnAuthorizedError } from "../errors/customError.js";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";
import mongoose from "mongoose";
import User from "../models/UserModel.js";


const withValidationErrors = (validateValues) => {
    return [
        validateValues,
        (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                const errorMessages = errors.array().map((error) => error.message);

                if(errorMessages[0].startsWith('not authorized')) {
                    throw new UnAuthorizedError('not authorized to perform this action');
                }

                throw new BadRequestError(errorMessages)
            }
            next();
        }
    ];

};

export const validateTest = withValidationErrors([
    body('name')
        .notEmpty()
        .withMessage('name is required')
        .isLength({min: 3, max: 50})
        .withMessage('name must be at least 3 characters')
        .trim()
]);

export const validateIdParam = withValidationErrors([
    param('id').custom(async (value, {req}) => {
        const isValidId = mongoose.Types.ObjectId.isValid(value);

        if(!isValidId) {
            throw new BadRequestError('invalid MongoDB id');
        }
    })
]);


export const validateRegisterInput = withValidationErrors([
    body('name')
        .notEmpty()
        .withMessage('name is required')
        .isLength({min: 3, max: 50})
        .withMessage('name must be at least 3 characters')
        .trim(),
    body('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('email is invalid')
        .custom(async (email) => {
            const user = await User.findOne({email});

            if(user) {
                throw new BadRequestError('email already exists');
            }
        }),
    body('password')
        .notEmpty()
        .withMessage('password is required')
        .isLength({min: 4})
        .withMessage('password must be at least 4 characters')
]);

export const validateLoginInput = withValidationErrors([
    body('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('email is invalid'),
    body('password')
        .notEmpty()
        .withMessage('password is required')
]);

export const validateUpdateUserInput = withValidationErrors([
    body('name')
        .optional()
        .isLength({min: 3, max: 50})
        .withMessage('name must be at least 3 characters')
        .trim(),
    body('email')
        .optional()
        .isEmail()
        .withMessage('email is invalid')
        .custom(async (email, {req}) => {
            const user = await User.findOne({email});

            if (user && user._id.toString() !== req.user.userId) {
                throw new BadRequestError('email already exists');
            }
        }),
    body('password')
        .optional()
        .isLength({min: 4})
        .withMessage('password must be at least 4 characters'),
    body('lastName').notEmpty().withMessage('lastName is required').trim(),
    body('location').notEmpty().withMessage('location is required').trim(),
]);
