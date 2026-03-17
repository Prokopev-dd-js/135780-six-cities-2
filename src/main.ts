import { Application } from './application.js';
import config from './config.js';
import logger from './logger.js';
import 'reflect-metadata';
import container from './container.js';
import { connectDatabase } from './database.js';

async function bootstrap() {
  await connectDatabase();
  const app = container.get(Application);
  app.init();
  const port = config.get('PORT');
  logger.info(`Приложение будет слушать порт: ${port}`);
}

bootstrap();
