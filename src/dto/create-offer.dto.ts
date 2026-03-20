export interface CreateOfferDto {
  title: string;
  description: string;
  publicationDate: Date;
  city: string;
  previewImage?: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  type: string;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: string[];
  hostName: string;
  hostEmail: string;
  hostAvatar?: string;
  hostType: string;
  latitude: number;
  longitude: number;
}
