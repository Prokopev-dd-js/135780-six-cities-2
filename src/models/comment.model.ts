import { getModelForClass } from '@typegoose/typegoose';
import { CommentEntity } from '../entities/comment.entity.js';

export { CommentEntity };
export const CommentModel = getModelForClass(CommentEntity);
