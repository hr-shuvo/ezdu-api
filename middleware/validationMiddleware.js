import User from "../models/auth/UserModel.js";
import { body, validationResult } from "express-validator";
import { BadRequestError, UnAuthorizedError } from "../errors/customError.js";

const withValidationErrors = (validateValues) => {
    return [
        validateValues,
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map((error) => error.msg);

                if(errorMessages[0].startsWith('not authorized')){
                    throw new UnAuthorizedError('not authorized to perform this action');
                }

                throw new BadRequestError(errorMessages)
            }
            next();
        }
    ];
};

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

            if (user) {
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