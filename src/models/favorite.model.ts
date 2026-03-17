import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { User } from './user.model.js';
import { Offer } from './offer.model.js';

export class Favorite {
  @prop({ ref: () => User, required: true }) user!: Ref<User>;
  @prop({ ref: () => Offer, required: true }) offer!: Ref<Offer>;
  @prop({ default: Date.now }) createdAt?: Date;
  @prop({ default: Date.now }) updatedAt?: Date;
}

export const FavoriteModel = getModelForClass(Favorite);
