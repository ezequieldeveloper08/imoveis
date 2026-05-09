import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactSchema } from './infrastructure/repositories/contact.schema';
import { ContactRepository } from './domain/repositories/contact.repository';
import { TypeOrmContactRepository } from './infrastructure/repositories/typeorm-contact.repository';
import { ContactService } from './application/services/contact.service';
import { ContactController } from './presentation/controllers/contact.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ContactSchema])],
  controllers: [ContactController],
  providers: [
    ContactService,
    {
      provide: ContactRepository,
      useClass: TypeOrmContactRepository,
    },
  ],
  exports: [ContactService, ContactRepository],
})
export class ContactModule {}
