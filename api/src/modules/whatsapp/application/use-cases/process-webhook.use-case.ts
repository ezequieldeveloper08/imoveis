import { Injectable, Inject } from '@nestjs/common';
import { IWHATSAPP_REPOSITORY } from '../../domain/repositories/whatsapp.repository';
import type { IWhatsappRepository } from '../../domain/repositories/whatsapp.repository';
import { WhatsappMessage, MessageDirection, MessageSenderType } from '../../domain/entities/whatsapp-message.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LeadService } from '../../../leads/application/services/lead.service';

@Injectable()
export class ProcessWebhookUseCase {
  constructor(
    @Inject(IWHATSAPP_REPOSITORY)
    private readonly whatsappRepository: IWhatsappRepository,
    @InjectRepository(WhatsappMessage)
    private readonly messageRepository: Repository<WhatsappMessage>,
    private readonly leadService: LeadService,
  ) {}

  async execute(payload: any) {
    // 1. Basic validation of Meta Payload
    const entry = payload.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value || !value.messages) return;

    const message = value.messages[0];
    const contact = value.contacts?.[0];
    const phoneNumber = message.from;
    const messageContent = message.text?.body || '';
    const metaMessageId = message.id;

    // 2. Find or Create Lead
    let lead = await this.leadService.findByPhone(phoneNumber);
    if (!lead) {
      lead = await this.leadService.create({
        name: contact?.profile?.name || 'Lead WhatsApp',
        phone: phoneNumber,
        source: 'WhatsApp Cloud API',
        status: 'new',
      });
    }

    // 3. Save Incoming Message
    const newMessage = this.messageRepository.create({
      metaMessageId,
      leadId: lead.id,
      direction: MessageDirection.INCOMING,
      senderType: MessageSenderType.LEAD,
      content: messageContent,
      messageType: message.type,
      metadata: message,
    });

    await this.messageRepository.save(newMessage);

    // 4. AI Logic (Placeholder for next step)
    // Here we will call the AIService if lead.isAiActive is true
    
    return { success: true, leadId: lead.id };
  }
}
