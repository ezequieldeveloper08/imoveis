import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationService } from './application/services/conversation.service';
import { ConversationController } from './presentation/controllers/conversation.controller';
import { ConversationRepository } from './domain/repositories/conversation.repository';
import { TypeOrmConversationRepository } from './infrastructure/repositories/typeorm-conversation.repository';
import { ConversationSchema, MessageSchema } from './infrastructure/repositories/conversation.schema';
import { ChatGateway } from './presentation/gateways/chat.gateway';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { LeadModule } from '../leads/leads.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationSchema, MessageSchema]),
    forwardRef(() => WhatsappModule),
    LeadModule,
  ],
  controllers: [ConversationController],
  providers: [
    ConversationService,
    ChatGateway,
    {
      provide: ConversationRepository,
      useClass: TypeOrmConversationRepository,
    },
  ],
  exports: [ConversationService, ConversationRepository, ChatGateway],
})
export class ConversationModule {}
