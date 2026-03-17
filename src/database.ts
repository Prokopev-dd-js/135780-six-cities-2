import mongoose from 'mongoose';
import logger from './logger.js';
import config from './config.js';

export async function connectDatabase() {
  const dbHost = config.get('DB_HOST');
  logger.info(`Попытка подключения к базе данных по адресу: ${dbHost}`);
  try {
    await mongoose.connect(`mongodb://${dbHost}/six-cities`);
    logger.info('Соединение с базой данных установлено');
  } catch (error) {
    logger.error('Ошибка подключения к базе данных:');
    throw error;
  }
}
