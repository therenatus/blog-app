import {body} from "express-validator";
import { userCollection} from "../../index";

const urlPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const FindCheckEmailValidator = [
  body('email').trim().isString().matches(urlPattern).custom(async(email) => {
    const user = await userCollection.findOne({'accountData.email': email});
    if(!user) {
      throw new Error('User not found');
    }
    if(user.emailConfirmation.isConfirmed){
      throw new Error('User is confirmed');
    }
    return true;
  })
];