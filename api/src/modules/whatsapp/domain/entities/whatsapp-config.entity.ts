import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum WhatsappStatus {
  DISCONNECTED = 'disconnected',
  PENDING = 'pending',
  CONNECTED = 'connected',
  ERROR = 'error',
}

@Entity('whatsapp_configs')
export class WhatsappConfig {
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

  @Column({ type: 'jsonb', nullable: true })
  aiSettings: {
    agentName: string;
    personality: string;
    systemPrompt: string;
    transferThreshold: number; // Score to transfer to human
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
