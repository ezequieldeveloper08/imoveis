export class Conversation {
  id: string;
  leadId: string;
  userId: string;
  organizationId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Conversation>) {
    Object.assign(this, partial);
  }
}

export class Message {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  createdAt: Date;

  constructor(partial: Partial<Message>) {
    Object.assign(this, partial);
  }
}
