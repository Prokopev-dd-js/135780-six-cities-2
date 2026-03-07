import { getModelForClass, prop } from '@typegoose/typegoose';

export class User {
  @prop({ required: true }) name!: string;
  @prop({ required: true, unique: true }) email!: string;
  @prop() avatar?: string;
  @prop({ required: true }) type!: string;
  @prop({ default: Date.now }) createdAt?: Date;
  @prop({ default: Date.now }) updatedAt?: Date;
}

export const UserModel = getModelForClass(User);

