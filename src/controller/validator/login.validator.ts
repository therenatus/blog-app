import {body, oneOf} from "express-validator";
export const LoginValidator = [
    body('password').trim().isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 and 20 characters'),
    oneOf([
      body('loginOrEmail').trim().isString().isLength({ min: 3, max: 10 }).withMessage('Login must be between 3 and 10 characters'),
      body('loginOrEmail').trim().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('Invalid email format')
    ])
];
