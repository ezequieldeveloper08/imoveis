import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity('conversations')
export class ConversationSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  leadId: string;

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

  @CreateDateColumn()
  createdAt: Date;
}
