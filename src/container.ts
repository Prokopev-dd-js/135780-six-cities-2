import { Container } from 'inversify';
import { Application } from './application.js';

const container = new Container();

container.bind(Application).toSelf();

export default container;
