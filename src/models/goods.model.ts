import { getModelForClass, prop } from '@typegoose/typegoose';

export class Goods {
  @prop({ required: true, unique: true }) name!: string;
  @prop({ default: Date.now }) createdAt?: Date;
  @prop({ default: Date.now }) updatedAt?: Date;
}

export const GoodsModel = getModelForClass(Goods);
