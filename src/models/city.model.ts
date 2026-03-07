import { getModelForClass, prop } from '@typegoose/typegoose';

export class City {
  @prop({ required: true, unique: true }) name!: string;
  @prop({ required: true }) latitude!: number;
  @prop({ required: true }) longitude!: number;
  @prop({ default: Date.now }) createdAt?: Date;
  @prop({ default: Date.now }) updatedAt?: Date;
}

export const CityModel = getModelForClass(City);
