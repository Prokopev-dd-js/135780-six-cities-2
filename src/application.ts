import { injectable } from 'inversify';
import logger from './logger.js';

@injectable()
export class Application {
  public init(): void {
    logger.info('Приложение инициализировано');
  }
}
