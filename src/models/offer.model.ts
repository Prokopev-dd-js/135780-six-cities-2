import { getModelForClass } from '@typegoose/typegoose';
import { OfferEntity } from '../entities/offer.entity.js';

export { OfferEntity };
export const OfferModel = getModelForClass(OfferEntity);
