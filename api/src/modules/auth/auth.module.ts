import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './application/services/auth.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { UserController } from './presentation/controllers/user.controller';
import { UserRepository } from './domain/repositories/user.repository';
import { TypeOrmUserRepository } from './infrastructure/repositories/typeorm-user.repository';
import { UserSchema } from './infrastructure/repositories/user.schema';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { OrganizationRepository } from '../organizations/domain/repositories/organization.repository';
import { TypeOrmOrganizationRepository } from '../organizations/infrastructure/repositories/typeorm-organization.repository';
import { OrganizationSchema } from '../organizations/infrastructure/repositories/organization.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSchema, OrganizationSchema]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: UserRepository,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: OrganizationRepository,
      useClass: TypeOrmOrganizationRepository,
    },
  ],
  exports: [AuthService, UserRepository],
})
export class AuthModule {}
