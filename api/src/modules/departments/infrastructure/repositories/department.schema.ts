import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserSchema } from 'src/modules/auth/infrastructure/repositories/user.schema';

@Entity('departments')
export class DepartmentSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  managerId: string;

  @ManyToOne(() => UserSchema, { nullable: true })
  @JoinColumn({ name: 'managerId' })
  manager: UserSchema;

  @Column({ nullable: true })
  color: string;

  @Column()
  organizationId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
