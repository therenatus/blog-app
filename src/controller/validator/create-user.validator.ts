import {body} from "express-validator";
import {blogCollection, userCollection} from "../../index";

export const CreateUserValidator = [
    body('login').trim().isString().isLength({min: 3, max: 10}).custom(async(login) => {
      const user = await userCollection.findOne({'accountData.login': login});
      if(user) {
        throw new Error('Login is taken');
      }
      return true;
    }),
    body('password').trim().isLength({min: 6, max: 20}),
    body('email').trim().notEmpty().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).custom(async(email) => {
      const user = await userCollection.findOne({'accountData.email': email});
      if(user) {
        throw new Error('Email is taken');
      }
      return true;
    })
]
