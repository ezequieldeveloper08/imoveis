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
      relations: ['messages', 'lead'],
      order: { 
        updatedAt: 'DESC',
        messages: {
          createdAt: 'ASC'
        }
      }
    });
    
    return convs.map(conv => {
      const unreadCount = conv.messages?.filter(m => !m.isRead && m.senderId === conv.leadId).length || 0;
      return new Conversation({ ...conv, unreadCount });
    });
  }

  async findById(id: string): Promise<Conversation | null> {
    const conv = await this.conversationRepo.findOne({ 
      where: { id },
      relations: ['messages', 'lead'],
      order: {
        messages: {
          createdAt: 'ASC'
        }
      }
    });

    if (!conv) return null;
    const unreadCount = conv.messages?.filter(m => !m.isRead && m.senderId === conv.leadId).length || 0;
    return new Conversation({ ...conv, unreadCount });
  }

  async create(conversation: Partial<Conversation>): Promise<Conversation> {
    const newConv = this.conversationRepo.create(conversation);
    await this.conversationRepo.save(newConv);
    return new Conversation(newConv);
  }
  
  async update(id: string, data: Partial<Conversation>): Promise<void> {
    await this.conversationRepo.update(id, data);
  }

  async addMessage(message: Partial<Message>): Promise<Message> {
    const newMessage = this.messageRepo.create(message);
    await this.messageRepo.save(newMessage);
    return new Message(newMessage);
  }

  async findMessagesByConversation(conversationId: string): Promise<Message[]> {
    const messages = await this.messageRepo.find({ 
      where: { conversationId },
      order: { createdAt: 'ASC' }
    });
    return messages.map(msg => new Message(msg));
  }

  async markAsRead(conversationId: string): Promise<void> {
    const conversation = await this.conversationRepo.findOne({ where: { id: conversationId } });
    if (conversation) {
      await this.messageRepo.update(
        { conversationId, senderId: conversation.leadId, isRead: false }, 
        { isRead: true }
      );
    }
  }
}
