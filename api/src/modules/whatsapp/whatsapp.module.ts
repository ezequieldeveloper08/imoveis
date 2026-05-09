import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsappController } from './presentation/controllers/whatsapp.controller';
import { ProcessWebhookUseCase } from './application/use-cases/process-webhook.use-case';
import { WhatsappConfig } from './domain/entities/whatsapp-config.entity';
import { WhatsappMessage } from './domain/entities/whatsapp-message.entity';
import { IWHATSAPP_REPOSITORY } from './domain/repositories/whatsapp.repository';
import { WhatsappRepository } from './infrastructure/repositories/whatsapp.repository';
import { LeadModule } from '../leads/leads.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WhatsappConfig, WhatsappMessage]),
    LeadModule,
  ],
  controllers: [WhatsappController],
  providers: [
    ProcessWebhookUseCase,
    {
      provide: IWHATSAPP_REPOSITORY,
      useClass: WhatsappRepository,
    },
  ],
  exports: [IWHATSAPP_REPOSITORY],
})
export class WhatsappModule { }
