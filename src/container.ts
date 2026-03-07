import { Container } from 'inversify';
import { Application } from './application.js';
import { UserService } from './modules/user.service.js';
import { UserModel } from './models/user.model.js';
import { OfferModel } from './models/offer.model.js';
import { FavoriteModel } from './models/favorite.model.js';
import { TypeModel } from './models/type.model.js';
import { ImageModel } from './models/image.model.js';

const container = new Container();

container.bind(Application).toSelf();
container.bind(UserService).toSelf();
container.bind('UserModel').toConstantValue(UserModel);
container.bind('OfferModel').toConstantValue(OfferModel);
container.bind('FavoriteModel').toConstantValue(FavoriteModel);
container.bind('TypeModel').toConstantValue(TypeModel);
container.bind('ImageModel').toConstantValue(ImageModel);

export default container;

