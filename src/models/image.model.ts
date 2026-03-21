import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { OfferEntity } from './offer.model.js';

export class Image {
  @prop({ required: true }) url!: string;
  @prop({ ref: () => OfferEntity }) offer?: Ref<OfferEntity>;
  @prop({ default: Date.now }) createdAt?: Date;
  @prop({ default: Date.now }) updatedAt?: Date;
}

export const ImageModel = getModelForClass(Image);
