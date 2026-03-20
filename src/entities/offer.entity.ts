import { prop, Ref } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';

export class OfferEntity {
  @prop({ required: true })
  public title!: string;

  @prop({ required: true })
  public description!: string;

  @prop({ required: true })
  public publicationDate!: Date;

  @prop({ required: true })
  public city!: string;

  @prop()
  public previewImage?: string;

  @prop({ type: () => [String], default: [] })
  public images!: string[];

  @prop({ required: true })
  public isPremium!: boolean;

  @prop({ required: true, default: false })
  public isFavorite!: boolean;

  @prop({ required: true, default: 0 })
  public rating!: number;

  @prop({ required: true, default: 0 })
  public commentsCount!: number;

  @prop({ required: true })
  public type!: string;

  @prop({ required: true })
  public bedrooms!: number;

  @prop({ required: true })
  public maxAdults!: number;

  @prop({ required: true })
  public price!: number;

  @prop({ type: () => [String], default: [] })
  public goods!: string[];

  @prop({ ref: () => UserEntity })
  public author?: Ref<UserEntity>;

  @prop({ required: true })
  public hostName!: string;

  @prop({ required: true })
  public hostEmail!: string;

  @prop()
  public hostAvatar?: string;

  @prop({ required: true })
  public hostType!: string;

  @prop({ required: true })
  public latitude!: number;

  @prop({ required: true })
  public longitude!: number;

  @prop({ default: Date.now })
  public createdAt?: Date;

  @prop({ default: Date.now })
  public updatedAt?: Date;
}
