import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password?: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ['ADMIN', 'AGENT', 'MANAGER'],
    default: 'AGENT',
  })
  role: 'ADMIN' | 'AGENT' | 'MANAGER';

  @Column({ nullable: true })
  department?: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: 'active' | 'inactive';

  @Column()
  organizationId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
