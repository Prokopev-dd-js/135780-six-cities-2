import convict from 'convict';
import convictFormatWithValidator from 'convict-format-with-validator';
import dotenv from 'dotenv';

dotenv.config();
convict.addFormats(convictFormatWithValidator);

const config = convict({
  PORT: {
    doc: 'Порт, на котором работает приложение',
    format: 'port',
    default: null,
    env: 'PORT'
  },
  DB_HOST: {
    doc: 'Адрес сервера базы данных',
    format: 'ipaddress',
    default: null,
    env: 'DB_HOST'
  },
  SALT: {
    doc: 'Соль для хеширования',
    format: String,
    default: null,
    env: 'SALT'
  }
});

config.validate({ allowed: 'strict' });

export default config;
