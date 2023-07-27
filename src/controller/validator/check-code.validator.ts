import {body} from "express-validator";
import { userCollection} from "../../index";

export const CheckCodeValidator = [
  body('code').trim().isString().custom(async(code) => {
    const user = await userCollection.findOne({'emailConfirmation.confirmationCode': code});
    if(!user) {
      throw new Error('User not found');
    }
    if(user.emailConfirmation.isConfirmed){
      throw new Error('User is confirmed');
    }
    if(user.emailConfirmation.expirationDate < new Date()){
      throw new Error('Link is expired');
    }
    return true;
  })
];