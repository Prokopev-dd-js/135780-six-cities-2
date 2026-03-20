import { CreateCommentDto } from '../dto/create-comment.dto.js';
import { CommentEntity } from '../entities/comment.entity.js';

export interface ICommentService {
  getByOfferId(offerId: string, limit?: number): Promise<CommentEntity[]>;
  create(offerId: string, userId: string, commentData: CreateCommentDto): Promise<CommentEntity>;
  deleteByOfferId(offerId: string): Promise<void>;
  countByOfferId(offerId: string): Promise<number>;
}
