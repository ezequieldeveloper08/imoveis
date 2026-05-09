export enum MessageDirection {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing',
}

export enum MessageSenderType {
  LEAD = 'lead',
  HUMAN = 'human',
  AI = 'ai',
  SYSTEM = 'system',
}

export class WhatsappMessage {
  id: string;
  metaMessageId: string;
  leadId: string;
  direction: MessageDirection;
  senderType: MessageSenderType;
  content: string;
  messageType: string;
  metadata?: any;
  createdAt: Date;

  constructor(partial: Partial<WhatsappMessage>) {
    Object.assign(this, partial);
  }
}
