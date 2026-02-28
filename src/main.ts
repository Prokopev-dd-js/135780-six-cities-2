import { Application } from './application.js';
import config from './config.js';
import logger from './logger.js';
import 'reflect-metadata';
import container from './container.js';

const app = container.get(Application);
app.init();

const port = config.get('PORT');
logger.info(`Приложение будет слушать порт: ${port}`);
