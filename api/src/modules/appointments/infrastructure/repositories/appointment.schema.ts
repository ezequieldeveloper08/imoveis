import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('appointments')
export class AppointmentSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  propertyId: string;

  @Column()
  leadId: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ default: 'SCHEDULED' })
  status: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  organizationId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
