import { getModelForClass } from '@typegoose/typegoose';
import { UserEntity } from '../entities/user.entity.js';

export { UserEntity };
export const UserModel = getModelForClass(UserEntity);
