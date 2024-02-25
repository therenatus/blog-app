import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';

@Schema()
export class AccountData {
  @Prop()
  id: string;

  @Prop()
  login: string;

  @Prop()
  email: string;

  @Prop()
  createdAt: Date;

  @Prop({ select: false })
  password: string;
}

@Schema()
export class EmailConfirmation {
  @Prop()
  confirmationCode: string;

  @Prop()
  expirationDate: Date;

  @Prop()
  isConfirmed: boolean;
}

@Schema()
export class User {
  @Prop()
  accountData: AccountData;

  @Prop()
  emailConfirmation: EmailConfirmation;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.statics.makeInstance = function (
  dto: CreateUserDto,
  confirmationCode: string,
) {
  const date = new Date();
  return new this({
    accountData: {
      ...dto,
    },
    emailConfirmation: {
      confirmationCode,
      expirationDate: date.setMinutes(date.getMinutes() + 15),
      isConfirmed: false,
    },
  });
};

export type UserDocument = HydratedDocument<User>;
export type UserStaticType = {
  makeInstance(dto: CreateUserDto, confirmationCode: string): UserDocument;
};
export type UserModelType = Model<User> & UserStaticType;
