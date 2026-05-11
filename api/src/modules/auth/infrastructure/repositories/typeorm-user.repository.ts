import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UserSchema } from './user.schema';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly repository: Repository<UserSchema>,
  ) {}

  async findByOrganization(orgId: string): Promise<User[]> {
    const users = await this.repository.find({ where: { organizationId: orgId } });
    return users.map(user => new User(user));
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { email } });
    return user ? new User(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { id } });
    return user ? new User(user) : null;
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.repository.create(user);
    await this.repository.save(newUser);
    return new User(newUser);
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    await this.repository.update(id, user);
    const updated = await this.findById(id);
    return updated!;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
