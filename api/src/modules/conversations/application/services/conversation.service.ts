import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { Conversation, Message } from '../../domain/entities/conversation.entity';
import { InstanceService } from '../../../whatsapp/application/services/instance.service';
import { LeadService } from '../../../leads/application/services/lead.service';
import { ChatGateway } from '../../presentation/gateways/chat.gateway';

@Injectable()
export class ConversationService {
  constructor(
    private readonly repository: ConversationRepository,
    private readonly instanceService: InstanceService,
    private readonly leadService: LeadService,
    private readonly chatGateway: ChatGateway,
  ) {}

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

  async addMessage(
    conversationId: string, 
    senderId: string, 
    content: string,
    options?: { mediaUrl?: string, mediaType?: 'image' | 'video' | 'document' }
  ) {
    const conversation = await this.findOne(conversationId);
    
    // Save to DB
    const savedMessage = await this.repository.addMessage({
      conversationId,
      senderId,
      content: content || (options?.mediaUrl ? '[Mídia]' : ''),
      mediaUrl: options?.mediaUrl,
      mediaType: options?.mediaType,
    });

    // Update conversation timestamp to bring it to top in UI
    await this.repository.update(conversationId, { updatedAt: new Date() });

    // Emit real-time events
    this.chatGateway.emitNewMessage(conversation.organizationId, savedMessage);
    this.chatGateway.emitConversationUpdated(conversation.organizationId, {
      id: conversation.id,
      updatedAt: new Date(),
    });

    // Send via WhatsApp if it's a WhatsApp conversation AND it's not an incoming message from the lead
    try {
      const lead = await this.leadService.findOne(conversation.leadId);
      const isIncomingFromLead = senderId === lead.id;

      if (!isIncomingFromLead) {
        const phoneNumber = lead.phone;
        // Find instances for this organization
        const instances = await this.instanceService.listInstances(conversation.organizationId);
        if (instances && instances.length > 0 && phoneNumber) {
          const instanceName = instances[0].name; // Using name instead of instanceName
          
          if (options?.mediaUrl) {
            try {
              await this.instanceService.sendMedia(instanceName, phoneNumber, options.mediaUrl, content, options.mediaType || 'image');
            } catch (mediaError) {
              console.warn('Failed to send media, falling back to text:', mediaError.message);
              await this.instanceService.sendMessage(instanceName, phoneNumber, content);
            }
          } else {
            await this.instanceService.sendMessage(instanceName, phoneNumber, content);
          }
        }
      }
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error);
    }

    return savedMessage;
  }

  async findMessages(conversationId: string) {
    await this.findOne(conversationId);
    return this.repository.findMessagesByConversation(conversationId);
  }

  async markAsRead(conversationId: string, organizationId: string) {
    await this.repository.markAsRead(conversationId);
    this.chatGateway.emitConversationUpdated(organizationId, { id: conversationId, unreadCount: 0 });
  }
}
