import axios from 'axios';
import { CliOffer } from './offer.type.js';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement<T>(arr: T[]): T {
  return arr[getRandomInt(0, arr.length - 1)];
}

function getRandomElements<T>(arr: T[], min = 1, max = arr.length): T[] {
  const count = getRandomInt(min, max);
  return arr.sort(() => 0.5 - Math.random()).slice(0, count);
}

export async function fetchBaseOffers(url: string): Promise<Partial<CliOffer>[]> {
  const response = await axios.get<Partial<CliOffer> | Partial<CliOffer>[]>(url);
  return Array.isArray(response.data) ? response.data : [response.data];
}

export function generateOffer(baseOffer: Partial<CliOffer>): CliOffer {
  const cities = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'];
  const types = ['apartment', 'house', 'room', 'hotel'];
  const goods = [
    'Breakfast', 'Air conditioning', 'Laptop friendly workspace',
    'Baby seat', 'Washer', 'Towels', 'Fridge'
  ];

  return {
    title: `${baseOffer.title ?? 'Без названия'} ${getRandomInt(1, 1000)}`,
    description: `${baseOffer.description ?? 'Без описания'} (${getRandomInt(1, 1000)})`,
    publicationDate: new Date().toISOString(),
    city: getRandomElement(cities),
    previewImage: baseOffer.previewImage ?? '',
    images: baseOffer.images ?? [],
    isPremium: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5,
    rating: +(Math.random() * 5).toFixed(1),
    type: getRandomElement(types),
    bedrooms: getRandomInt(1, 8),
    maxAdults: getRandomInt(1, 10),
    price: getRandomInt(100, 100000),
    goods: getRandomElements(goods, 1, goods.length),
    hostName: baseOffer.hostName ?? 'Без имени',
    hostEmail: baseOffer.hostEmail ?? '',
    hostAvatar: baseOffer.hostAvatar ?? '',
    hostType: getRandomElement(['обычный', 'pro']),
    latitude: baseOffer.latitude ? +(baseOffer.latitude + Math.random() * 0.01).toFixed(6) : 0,
    longitude: baseOffer.longitude ? +(baseOffer.longitude + Math.random() * 0.01).toFixed(6) : 0
  };
}

export function generateOffers(count: number, baseOffers: Partial<CliOffer>[]): CliOffer[] {
  const offers: CliOffer[] = [];

  for (let i = 0; i < count; i++) {
    const baseOffer = baseOffers[getRandomInt(0, baseOffers.length - 1)];
    offers.push(generateOffer(baseOffer));
  }

  return offers;
}
