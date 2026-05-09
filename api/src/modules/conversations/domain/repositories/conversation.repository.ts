import { Conversation, Message } from '../entities/conversation.entity';

export abstract class ConversationRepository {
  abstract findByOrganization(orgId: string): Promise<Conversation[]>;
  abstract findById(id: string): Promise<Conversation | null>;
  abstract create(conversation: Partial<Conversation>): Promise<Conversation>;
  abstract addMessage(message: Partial<Message>): Promise<Message>;
  abstract findMessagesByConversation(conversationId: string): Promise<Message[]>;
}
