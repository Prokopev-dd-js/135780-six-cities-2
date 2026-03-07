import axios from 'axios';
import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import { fileURLToPath } from 'node:url';
import logger from './logger.js';
import mongoose from 'mongoose';
import { OfferModel } from './models/offer.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.join(__dirname, '../package.json');
const version = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')).version;

function printHelp(): void {
  console.log(chalk.cyanBright(`
${chalk.bold('Программа для подготовки данных для REST API сервера.')}

${chalk.bold('Использование:')}
  cli.ts --<command> [--arguments]

${chalk.bold('Команды:')}
  ${chalk.green('--version')}                   # выводит номер версии
  ${chalk.green('--help')}                      # печатает этот текст
  ${chalk.green('--import <path> <dbUri>')}     # импортирует данные из TSV в MongoDB
`));
}

function printVersion(): void {
  console.log(chalk.yellowBright(`Версия приложения: ${version}`));
}

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

type Offer = {
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

function generateOffer(baseOffer: Partial<Offer>): Offer {
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

async function fetchBaseOffers(url: string): Promise<Partial<Offer>[]> {
  const response = await axios.get(url);
  return response.data;
}

function saveOffersToTsv(offers: Offer[], filePath: string): void {
  const headers = [
    'title', 'description', 'publicationDate', 'city', 'previewImage', 'images',
    'isPremium', 'isFavorite', 'rating', 'type', 'bedrooms', 'maxAdults', 'price',
    'goods', 'hostName', 'hostEmail', 'hostAvatar', 'hostType', 'latitude', 'longitude'
  ];
  const stream = fs.createWriteStream(filePath, { encoding: 'utf-8' });
  stream.write(`${headers.join('\t')}\n`);
  offers.forEach((offer) => {
    const row = [
      offer.title,
      offer.description,
      offer.publicationDate,
      offer.city,
      offer.previewImage,
      JSON.stringify(offer.images),
      offer.isPremium,
      offer.isFavorite,
      offer.rating,
      offer.type,
      offer.bedrooms,
      offer.maxAdults,
      offer.price,
      JSON.stringify(offer.goods),
      offer.hostName,
      offer.hostEmail,
      offer.hostAvatar,
      offer.hostType,
      offer.latitude,
      offer.longitude
    ].join('\t');
    stream.write(`${row}\n`);
  });
  stream.end();
}

async function importTsvToDb(filePath: string, dbUri: string): Promise<void> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Файл не найден: ${filePath}`);
  }

  await mongoose.connect(dbUri);
  console.log(chalk.greenBright('Соединение с MongoDB установлено'));

  const stream = fs.createReadStream(filePath, { encoding: 'utf-8' });
  let leftover = '';
  let isHeader = true;
  let headers: string[] = [];
  const createPromises: Promise<unknown>[] = [];

  await new Promise<void>((resolve, reject) => {
    stream.on('data', (chunk: string) => {
      const lines = (leftover + chunk).split('\n');
      leftover = lines.pop() ?? '';
      for (const line of lines) {
        if (isHeader) {
          headers = line.split('\t');
          isHeader = false;
        } else if (line.trim()) {
          const values = line.split('\t');
          const offerData: Record<string, unknown> = {};
          headers.forEach((header, idx) => {
            if (header === 'images' || header === 'goods') {
              try {
                offerData[header] = JSON.parse(values[idx]);
              } catch {
                offerData[header] = [];
              }
            } else if (
              header === 'isPremium' ||
              header === 'isFavorite'
            ) {
              offerData[header] = values[idx] === 'true';
            } else if (
              header === 'rating' ||
              header === 'bedrooms' ||
              header === 'maxAdults' ||
              header === 'price' ||
              header === 'latitude' ||
              header === 'longitude'
            ) {
              offerData[header] = Number(values[idx]);
            } else {
              offerData[header] = values[idx];
            }
          });
          createPromises.push(OfferModel.create(offerData));
        }
      }
    });

    stream.on('end', () => {
      if (leftover.trim()) {
        const values = leftover.split('\t');
        const offerData: Record<string, unknown> = {};
        headers.forEach((header, idx) => {
          if (header === 'images' || header === 'goods') {
            try {
              offerData[header] = JSON.parse(values[idx]);
            } catch {
              offerData[header] = [];
            }
          } else if (
            header === 'isPremium' ||
            header === 'isFavorite'
          ) {
            offerData[header] = values[idx] === 'true';
          } else if (
            header === 'rating' ||
            header === 'bedrooms' ||
            header === 'maxAdults' ||
            header === 'price' ||
            header === 'latitude' ||
            header === 'longitude'
          ) {
            offerData[header] = Number(values[idx]);
          } else {
            offerData[header] = values[idx];
          }
        });
        createPromises.push(OfferModel.create(offerData));
      }
      Promise.all(createPromises)
        .then(() => {
          console.log(chalk.magentaBright('Импорт завершён.'));
          resolve();
        })
        .catch((err) => {
          console.error(chalk.redBright('Ошибка сохранения данных:'), err);
          reject(err);
        });
    });

    stream.on('error', (err: Error) => {
      console.error(chalk.redBright('Ошибка чтения файла:'), err.message);
      reject(err);
    });
  });

  await mongoose.disconnect();
  process.exitCode = 1;
}

const [,, command, arg] = process.argv;

(async () => {
  try {
    switch (command) {
      case '--help':
      case undefined:
        printHelp();
        break;
      case '--version':
        printVersion();
        break;
      case '--generate': {
        if (!arg || isNaN(Number(arg)) || !process.argv[4] || !process.argv[5]) {
          throw new Error('Укажите количество, путь для сохранения и url JSON-сервера.');
        }
        const count = Number(arg);
        const filePath = process.argv[4];
        const url = process.argv[5];
        const baseOffers = await fetchBaseOffers(url);
        const offersArray = Array.isArray(baseOffers) ? baseOffers : [baseOffers];
        const offers: Offer[] = [];
        for (let i = 0; i < count; i++) {
          const baseOffer = offersArray[getRandomInt(0, offersArray.length - 1)];
          offers.push(generateOffer(baseOffer));
        }
        saveOffersToTsv(offers, filePath);
        console.log(chalk.greenBright(`Сгенерировано ${count} предложений и сохранено в ${filePath}`));
        break;
      }
      case '--import': {
        const filePath = arg;
        const dbUri = process.argv[4];
        if (!filePath || !dbUri) {
          throw new Error('Укажите путь к TSV-файлу и строку подключения к MongoDB.');
        }
        await importTsvToDb(filePath, dbUri);
        break;
      }
      default:
        printHelp();
        throw new Error('Неизвестная команда.');
    }
  } catch (err: unknown) {
    console.error(chalk.bgRedBright((err as Error).message));
    logger.error('Произошла ошибка');
    process.exitCode = 1;
  }
  logger.info('Приложение запущено');

})();
