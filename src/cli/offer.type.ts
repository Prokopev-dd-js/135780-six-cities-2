export type CliOffer = {
  title: string;
  description: string;
  publicationDate: string;
  city: string;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: string;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: string[];
  hostName: string;
  hostEmail: string;
  hostAvatar: string;
  hostType: string;
  latitude: number;
  longitude: number;
};

export type OfferImportPayload = Omit<CliOffer, 'publicationDate'> & {
  publicationDate: Date;
};
