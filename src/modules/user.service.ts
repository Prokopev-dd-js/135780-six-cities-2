import { UserModel, User } from '../models/user.model.js';
import { IUserService } from '../type/user-service.interface.js';

export class UserService implements IUserService {
  async findById(id: string): Promise<User | null> {
    return UserModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).exec();
  }

  async create(userData: Partial<User>): Promise<User> {
    return UserModel.create(userData);
  }
}

