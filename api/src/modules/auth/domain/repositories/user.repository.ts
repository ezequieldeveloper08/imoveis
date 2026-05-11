import { User } from '../entities/user.entity';

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByOrganization(orgId: string): Promise<User[]>;
  abstract create(user: Partial<User>): Promise<User>;
  abstract update(id: string, user: Partial<User>): Promise<User>;
  abstract delete(id: string): Promise<void>;
}
