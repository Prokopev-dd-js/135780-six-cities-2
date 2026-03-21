import { getModelForClass } from '@typegoose/typegoose';
import { FavoriteEntity } from '../entities/favorite.entity.js';

export { FavoriteEntity };
export const FavoriteModel = getModelForClass(FavoriteEntity);
