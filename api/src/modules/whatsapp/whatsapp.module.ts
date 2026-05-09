import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { WhatsappController } from './presentation/controllers/whatsapp.controller';
import { ProcessWebhookUseCase } from './application/use-cases/process-webhook.use-case';
import { WhatsappConfig } from './domain/entities/whatsapp-config.entity';
import { WhatsappMessage } from './domain/entities/whatsapp-message.entity';
import { IWHATSAPP_REPOSITORY } from './domain/repositories/whatsapp.repository';
import { WhatsappRepository } from './infrastructure/repositories/whatsapp.repository';
import { LeadModule } from '../leads/leads.module';
import { ConversationModule } from '../conversations/conversations.module';
import { EvolutionClient } from './infrastructure/services/evolution.client';
import { InstanceService } from './application/services/instance.service';
import { IWHATSAPP_PROVIDER } from './domain/providers/whatsapp.provider';
import { EvolutionProvider } from './infrastructure/providers/evolution.provider';
import { WhatsappConfigSchema, WhatsappMessageSchema } from './infrastructure/repositories/whatsapp.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([WhatsappConfigSchema, WhatsappMessageSchema]),
    HttpModule,
    LeadModule,
    forwardRef(() => ConversationModule),
  ],
  controllers: [WhatsappController],
  providers: [
    EvolutionClient,
    InstanceService,
    ProcessWebhookUseCase,
    {
      provide: IWHATSAPP_PROVIDER,
      useClass: EvolutionProvider,
    },
    {
      provide: IWHATSAPP_REPOSITORY,
      useClass: WhatsappRepository,
    },
  ],
  exports: [IWHATSAPP_REPOSITORY, IWHATSAPP_PROVIDER, InstanceService],
})
export class WhatsappModule { }
