import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { OrganizationRepository } from '../../../organizations/domain/repositories/organization.repository';

export interface RegisterOrganizationDto {
  organizationName: string;
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password!)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role, organizationId: user.organizationId };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId,
      },
    };
  }

  async registerWithOrganization(data: RegisterOrganizationDto) {
    // 1. Create the organization
    const org = await this.organizationRepository.create({
      name: data.organizationName,
    });

    // 2. Create the admin user bound to it
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: 'ADMIN',
      organizationId: org.id,
    });

    // 3. Return JWT so user is logged in immediately
    return this.login({ ...user, organizationId: org.id });
  }

  async addUserToOrganization(data: Partial<User>) {
    const hashedPassword = await bcrypt.hash(data.password!, 10);
    return this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
  }
}
