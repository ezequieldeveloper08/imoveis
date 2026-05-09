import { Injectable, Inject, Logger } from '@nestjs/common';
import { IWHATSAPP_REPOSITORY } from '../../domain/repositories/whatsapp.repository';
import type { IWhatsappRepository } from '../../domain/repositories/whatsapp.repository';
import { WhatsappMessageSchema, MessageDirection, MessageSenderType } from '../../infrastructure/repositories/whatsapp.schema';
import { WhatsappMessage } from '../../domain/entities/whatsapp-message.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LeadService } from '../../../leads/application/services/lead.service';
import { ConversationService } from '../../../conversations/application/services/conversation.service';

@Injectable()
export class ProcessWebhookUseCase {
  private readonly logger = new Logger(ProcessWebhookUseCase.name);

  constructor(
    @Inject(IWHATSAPP_REPOSITORY)
    private readonly whatsappRepository: IWhatsappRepository,
    @InjectRepository(WhatsappMessageSchema)
    private readonly messageRepository: Repository<WhatsappMessageSchema>,
    private readonly leadService: LeadService,
    private readonly conversationService: ConversationService,
  ) {}

  async execute(payload: any) {
    try {
      const event = payload.event;
      const instanceName = payload.instance;
      if (!event || !instanceName) return;

      // Find organizationId for this instance (handles both lower and uppercase legacy names)
      const config = await this.whatsappRepository.findOneByInstance(instanceName.toLowerCase()) || 
                     await this.whatsappRepository.findOneByInstance(instanceName.toUpperCase());
      
      const organizationId = config?.organizationId;

      this.logger.debug(`Incoming webhook: ${event} for instance: ${instanceName}. Organization: ${organizationId || 'NOT FOUND'}`);

      if (event === 'messages.upsert') {
        return await this.handleIncomingMessage(payload, organizationId);
      }

      if (event === 'connection.update') {
        this.logger.log(`Connection update for instance ${payload.instance}: ${payload.data.state}`);
        return;
      }

      return { success: true };
    } catch (error) {
      this.logger.error(`Error processing webhook: ${error.message}`, error.stack);
      return { success: false, error: error.message };
    }
  }

  private async handleIncomingMessage(payload: any, organizationId?: string) {
    try {
      const data = payload.data;
      const message = data.message;
      const key = data.key;

      if (key.fromMe) return; // Ignore messages sent by us

      const remoteJid = key.remoteJid;
      const phoneNumber = remoteJid.split('@')[0];
      const messageContent = message.conversation || message.extendedTextMessage?.text || '';
      const messageId = key.id;

      this.logger.log(`New message from ${phoneNumber} (${data.pushName}): "${messageContent}"`);

      // 1. Find or Create Lead
      let lead = await this.leadService.findByPhone(phoneNumber);
      const leadName = data.pushName || 'Contato WhatsApp';
      
      if (!lead) {
        lead = await this.leadService.create({
          name: leadName,
          phone: phoneNumber,
          source: 'WhatsApp',
          status: 'new',
          organizationId: organizationId,
        });
      } else if (lead.name.startsWith('Lead ') || lead.name === 'Contato WhatsApp') {
        // Update generic name with real pushName if available
        if (data.pushName) {
          await this.leadService.update(lead.id, { name: data.pushName });
        }
      }

      // 2. Find or Create Conversation for this lead
      const conversations = await this.conversationService.findByOrganization(organizationId || '');
      let conversation = conversations.find(c => c.leadId === lead.id);
      
      if (!conversation) {
        conversation = await this.conversationService.create({
          leadId: lead.id,
          organizationId: organizationId,
          userId: 'system', // Leads from WhatsApp are handled by the system initially
        });
      }

      // 3. Save to Conversations Module
      await this.conversationService.addMessage(conversation.id, lead.id, messageContent);

      // 4. Save to WhatsApp Module (Raw Log/Legacy)
      const newMessage = this.messageRepository.create({
        metaMessageId: messageId,
        leadId: lead.id,
        direction: MessageDirection.INCOMING,
        senderType: MessageSenderType.LEAD,
        content: messageContent,
        messageType: data.messageType || 'text',
        metadata: payload,
      });

      await this.messageRepository.save(newMessage);
      this.logger.log(`Message ${messageId} synced with Conversation ${conversation.id} for lead ${lead.id}`);

      return { success: true, leadId: lead.id };
    } catch (error) {
      this.logger.error(`Error handling incoming message: ${error.message}`, error.stack);
      throw error;
    }
  }
}
