import chalk from 'chalk';
import mongoose from 'mongoose';
import { OfferModel } from '../models/offer.model.js';
import { readOffersFromTsv } from './tsv.js';

async function createOffersWithRollback(offers: Awaited<ReturnType<typeof readOffersFromTsv>>): Promise<void> {
  const insertedIds: mongoose.Types.ObjectId[] = [];

  try {
    for (const offer of offers) {
      const createdOffer = await OfferModel.create(offer);
      insertedIds.push(createdOffer._id);
    }
  } catch (error) {
    if (insertedIds.length > 0) {
      await OfferModel.deleteMany({ _id: { $in: insertedIds } });
    }
    throw error;
  }
}

export async function importTsvToDb(filePath: string, dbUri: string): Promise<void> {
  await mongoose.connect(dbUri);
  console.log(chalk.greenBright('Соединение с MongoDB установлено'));

  try {
    const offers = await readOffersFromTsv(filePath);

    if (offers.length === 0) {
      console.log(chalk.yellowBright('Нет данных для импорта.'));
      return;
    }

    await createOffersWithRollback(offers);

    console.log(chalk.magentaBright(`Импорт завершен. Сохранено записей: ${offers.length}`));
  } catch (error) {
    console.error(chalk.redBright('Ошибка импорта данных:'), error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
}
