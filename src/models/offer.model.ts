import { getModelForClass, prop } from '@typegoose/typegoose';

export class Offer {
  @prop({ required: true }) title!: string;
  @prop({ required: true }) description!: string;
  @prop({ required: true }) publicationDate!: Date;
  @prop({ required: true }) city!: string;
  @prop() previewImage?: string;
  @prop({ type: () => [String] }) images?: string[];
  @prop({ required: true }) isPremium!: boolean;
  @prop({ required: true }) isFavorite!: boolean;
  @prop({ required: true }) rating!: number;
  @prop({ required: true }) type!: string;
  @prop({ required: true }) bedrooms!: number;
  @prop({ required: true }) maxAdults!: number;
  @prop({ required: true }) price!: number;
  @prop({ type: () => [String] }) goods?: string[];
  @prop({ required: true }) hostName!: string;
  @prop({ required: true }) hostEmail!: string;
  @prop() hostAvatar?: string;
  @prop({ required: true }) hostType!: string;
  @prop({ required: true }) latitude!: number;
  @prop({ required: true }) longitude!: number;
  @prop({ default: Date.now }) createdAt?: Date;
  @prop({ default: Date.now }) updatedAt?: Date;
}

export const OfferModel = getModelForClass(Offer);

