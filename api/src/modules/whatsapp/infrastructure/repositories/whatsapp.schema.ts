import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LeadSchema } from '../../../leads/infrastructure/repositories/lead.schema';

export enum WhatsappStatus {
  DISCONNECTED = 'disconnected',
  PENDING = 'pending',
  CONNECTED = 'connected',
  ERROR = 'error',
}

@Entity('whatsapp_configs')
export class WhatsappConfigSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'business_id', nullable: true })
  businessId: string;

  @Column({ name: 'phone_number_id', nullable: true })
  phoneNumberId: string;

  @Column({ name: 'access_token', nullable: true, select: false })
  accessToken: string;

  @Column({ name: 'verify_token', nullable: true })
  verifyToken: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: WhatsappStatus,
    default: WhatsappStatus.DISCONNECTED,
  })
  status: WhatsappStatus;

  @Column({ name: 'webhook_url', nullable: true })
  webhookUrl: string;

  @Column({ name: 'is_ai_enabled', default: false })
  isAiEnabled: boolean;

  @Column({ type: 'json', nullable: true })
  aiSettings: any;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @Column({ default: 'evolution' })
  provider: string;

  @Column({ name: 'instance_name', nullable: true })
  instanceName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

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

@Entity('whatsapp_messages')
export class WhatsappMessageSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'message_id', unique: true })
  metaMessageId: string;

  @Column({ name: 'lead_id' })
  leadId: string;

  @ManyToOne(() => LeadSchema)
  @JoinColumn({ name: 'lead_id' })
  lead: LeadSchema;

  @Column({
    type: 'enum',
    enum: MessageDirection,
  })
  direction: MessageDirection;

  @Column({
    type: 'enum',
    enum: MessageSenderType,
    default: MessageSenderType.LEAD,
  })
  senderType: MessageSenderType;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'message_type', default: 'text' })
  messageType: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
