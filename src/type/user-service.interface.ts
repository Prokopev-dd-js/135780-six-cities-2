import { User } from '../models/user.model.js';

export interface IUserService {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(userData: Partial<User>): Promise<User>;
}
