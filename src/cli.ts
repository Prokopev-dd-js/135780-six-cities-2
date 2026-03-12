import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import { fileURLToPath } from 'node:url';
import logger from './logger.js';
import { fetchBaseOffers, generateOffers } from './cli/generator.js';
import { saveOffersToTsv } from './cli/tsv.js';
import { importTsvToDb } from './cli/importer.js';

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
  ${chalk.green('--version')}                           # выводит номер версии
  ${chalk.green('--help')}                              # печатает этот текст
  ${chalk.green('--generate <count> <path> <jsonUrl>')} # генерирует TSV-данные
  ${chalk.green('--import <path> <dbUri>')}             # импортирует данные из TSV в MongoDB
`));
}

function printVersion(): void {
  console.log(chalk.yellowBright(`Версия приложения: ${version}`));
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
        if (!arg || Number.isNaN(Number(arg)) || !process.argv[4] || !process.argv[5]) {
          throw new Error('Укажите количество, путь для сохранения и url JSON-сервера.');
        }

        const count = Number(arg);
        const filePath = process.argv[4];
        const url = process.argv[5];

        const baseOffers = await fetchBaseOffers(url);
        const offers = generateOffers(count, baseOffers);

        await saveOffersToTsv(offers, filePath);
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
})();
