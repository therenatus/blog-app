import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';

@Schema()
export class User {
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

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.statics.makeInstance = function (dto: CreateUserDto) {
  const date = new Date();
  return new this({
    ...dto,
    createdAt: date,
    id: (+date).toString(),
  });
};

export type UserDocument = HydratedDocument<User>;
export type UserStaticType = {
  makeInstance(dto: CreateUserDto): UserDocument;
};
export type UserModelType = Model<User> & UserStaticType;
