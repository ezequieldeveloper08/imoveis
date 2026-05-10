import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LeadSchema } from '../../../leads/infrastructure/repositories/lead.schema';

@Entity('proposals')
export class ProposalSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  propertyId: string;

  @Column()
  leadId: string;

  @ManyToOne(() => LeadSchema, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'leadId' })
  lead: LeadSchema;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  value: number;

  @Column({ default: 'PENDING' })
  status: string;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  organizationId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
