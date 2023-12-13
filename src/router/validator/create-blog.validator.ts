import {body} from "express-validator";


const urlPattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.){1,}[a-zA-Z]{2,}(\/\S*)?$/;
export const CreateBlogValidator = [
    body('websiteUrl').isLength({min: 1, max: 100}).withMessage('invalid').matches(urlPattern).withMessage('dd'),
    body('name').trim().isString().isLength({min: 1, max: 15}),
    body('description').trim().isLength({min: 1, max: 500}),
];

