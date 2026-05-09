import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { LeadSchema } from '../../../leads/infrastructure/repositories/lead.schema';

@Entity('conversations')
export class ConversationSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  leadId: string;

  @ManyToOne(() => LeadSchema)
  @JoinColumn({ name: 'leadId' })
  lead: LeadSchema;

  @Column()
  userId: string;

  @Column()
  organizationId: string;

  @OneToMany(() => MessageSchema, (message) => message.conversation)
  messages: MessageSchema[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('messages')
export class MessageSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  senderId: string;

  @Column()
  conversationId: string;

  @ManyToOne(() => ConversationSchema, (conv) => conv.messages)
  @JoinColumn({ name: 'conversationId' })
  conversation: ConversationSchema;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @Column({ name: 'media_url', type: 'text', nullable: true })
  mediaUrl: string;

  @Column({ name: 'media_type', nullable: true })
  mediaType: string;

  @CreateDateColumn()
  createdAt: Date;
}
