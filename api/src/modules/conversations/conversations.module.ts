import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationService } from './application/services/conversation.service';
import { ConversationController } from './presentation/controllers/conversation.controller';
import { ConversationRepository } from './domain/repositories/conversation.repository';
import { TypeOrmConversationRepository } from './infrastructure/repositories/typeorm-conversation.repository';
import { ConversationSchema, MessageSchema } from './infrastructure/repositories/conversation.schema';

@Module({
  imports: [TypeOrmModule.forFeature([ConversationSchema, MessageSchema])],
  controllers: [ConversationController],
  providers: [
    ConversationService,
    {
      provide: ConversationRepository,
      useClass: TypeOrmConversationRepository,
    },
  ],
  exports: [ConversationService, ConversationRepository],
})
export class ConversationModule {}
