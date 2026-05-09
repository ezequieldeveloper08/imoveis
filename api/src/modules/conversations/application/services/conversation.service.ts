import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { Conversation, Message } from '../../domain/entities/conversation.entity';

@Injectable()
export class ConversationService {
  constructor(private readonly repository: ConversationRepository) {}

  async findByOrganization(orgId: string) {
    return this.repository.findByOrganization(orgId);
  }

  async findOne(id: string) {
    const conv = await this.repository.findById(id);
    if (!conv) throw new NotFoundException('Conversation not found');
    return conv;
  }

  async create(data: Partial<Conversation>) {
    return this.repository.create(data);
  }

  async addMessage(conversationId: string, senderId: string, content: string) {
    await this.findOne(conversationId);
    return this.repository.addMessage({
      conversationId,
      senderId,
      content,
    });
  }

  async findMessages(conversationId: string) {
    await this.findOne(conversationId);
    return this.repository.findMessagesByConversation(conversationId);
  }
}
