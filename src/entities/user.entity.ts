import { prop } from '@typegoose/typegoose';

export class UserEntity {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop()
  public avatar?: string;

  @prop({ required: true })
  public password!: string;

  @prop({ required: true })
  public type!: string;

  @prop({ default: Date.now })
  public createdAt?: Date;

  @prop({ default: Date.now })
  public updatedAt?: Date;
}
