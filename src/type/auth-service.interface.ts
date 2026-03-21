import { UserEntity } from '../entities/user.entity.js';

export interface IAuthService {
  login(email: string, password: string): Promise<string>;
  logout(token: string): void;
  verifyToken(token: string): boolean;
  getAuthStatus(token: string): Promise<UserEntity | null>;
}
