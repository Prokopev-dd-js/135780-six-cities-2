import { createHash, randomUUID } from 'node:crypto';
import { Types } from 'mongoose';
import { UserEntity } from '../entities/user.entity.js';
import { IAuthService } from '../type/auth-service.interface.js';
import { UserService } from './user.service.js';

const PASSWORD_SALT = 'six-cities-static-salt';

export class AuthService implements IAuthService {
  private readonly tokens = new Map<string, string>();

  constructor(private readonly userService: UserService = new UserService()) {}

  public hashPassword(password: string): string {
    return createHash('sha256')
      .update(`${password}:${PASSWORD_SALT}`)
      .digest('hex');
  }

  public async login(email: string, password: string): Promise<string> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error('Пользователь с таким email не найден.');
    }

    const passwordHash = this.hashPassword(password);
    if (user.password !== passwordHash) {
      throw new Error('Неверный пароль.');
    }

    const token = randomUUID();
    const userDocument = user as UserEntity & { _id: Types.ObjectId };
    this.tokens.set(token, userDocument._id.toString());
    return token;
  }

  public logout(token: string): void {
    this.tokens.delete(token);
  }

  public verifyToken(token: string): boolean {
    return this.tokens.has(token);
  }

  public async getAuthStatus(token: string): Promise<UserEntity | null> {
    const userId = this.tokens.get(token);
    if (!userId) {
      return null;
    }

    return this.userService.findById(userId);
  }
}
