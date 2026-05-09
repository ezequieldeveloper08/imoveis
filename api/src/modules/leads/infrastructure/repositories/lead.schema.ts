import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('leads')
export class LeadSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  contactId: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: 'NEW' })
  status: string;

  @Column({ nullable: true })
  source: string;

  @Column()
  organizationId: string;

  @Column({ nullable: true })
  propertyId: string;

  @Column({ nullable: true })
  interest: string;

  @Column({ type: 'simple-json', nullable: true })
  allInterests: string[];

  @Column({ nullable: true })
  lostReason: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  value: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
