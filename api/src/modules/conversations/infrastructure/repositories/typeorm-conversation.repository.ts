import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { Conversation, Message } from '../../domain/entities/conversation.entity';
import { ConversationSchema, MessageSchema } from './conversation.schema';

@Injectable()
export class TypeOrmConversationRepository implements ConversationRepository {
  constructor(
    @InjectRepository(ConversationSchema)
    private readonly conversationRepo: Repository<ConversationSchema>,
    @InjectRepository(MessageSchema)
    private readonly messageRepo: Repository<MessageSchema>,
  ) {}

  async findByOrganization(orgId: string): Promise<Conversation[]> {
    const convs = await this.conversationRepo.find({ 
      where: { organizationId: orgId },
      relations: ['messages']
    });
    return convs.map(conv => new Conversation(conv));
  }

  async findById(id: string): Promise<Conversation | null> {
    const conv = await this.conversationRepo.findOne({ 
      where: { id },
      relations: ['messages']
    });
    return conv ? new Conversation(conv) : null;
  }

  async create(conversation: Partial<Conversation>): Promise<Conversation> {
    const newConv = this.conversationRepo.create(conversation);
    await this.conversationRepo.save(newConv);
    return new Conversation(newConv);
  }

  async addMessage(message: Partial<Message>): Promise<Message> {
    const newMessage = this.messageRepo.create(message);
    await this.messageRepo.save(newMessage);
    return new Message(newMessage);
  }

  async findMessagesByConversation(conversationId: string): Promise<Message[]> {
    const messages = await this.messageRepo.find({ where: { conversationId } });
    return messages.map(msg => new Message(msg));
  }
}
