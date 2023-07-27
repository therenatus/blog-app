import {body} from "express-validator";
export const CreateCommentValidator = [
    body('content').isLength({min: 20, max: 300}).withMessage('Content must be between 20 and 300 characters')
]