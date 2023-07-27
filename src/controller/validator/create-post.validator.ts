import {body} from "express-validator";
import {blogCollection} from "../../index";

export const createPostValidator = [
    body('title').trim().isString().isLength({min: 1, max: 15}),
    body('shortDescription').trim().isLength({min: 1, max: 100}),
    body('content').trim().isLength({min: 1, max: 1000}),
    body('blogId').trim().isString().custom(async(blogId) => {
      const blog = await blogCollection.findOne({id: blogId});
      if(!blog) {
        throw new Error('BlogID not found');
      }
      return true;
    })
  ];
