import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentRepository } from '../../domain/repositories/appointment.repository';
import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentSchema } from './appointment.schema';

@Injectable()
export class TypeOrmAppointmentRepository implements AppointmentRepository {
  constructor(
    @InjectRepository(AppointmentSchema)
    private readonly repository: Repository<AppointmentSchema>,
  ) {}

  async findByProperty(propertyId: string): Promise<Appointment[]> {
    const appointments = await this.repository.find({ where: { propertyId } });
    return appointments.map(a => new Appointment(a as any));
  }

  async findByLead(leadId: string): Promise<Appointment[]> {
    const appointments = await this.repository.find({ where: { leadId } });
    return appointments.map(a => new Appointment(a as any));
  }

  async findByOrganization(orgId: string): Promise<Appointment[]> {
    const appointments = await this.repository.find({ where: { organizationId: orgId } });
    return appointments.map(a => new Appointment(a as any));
  }

  async findById(id: string): Promise<Appointment | null> {
    const appointment = await this.repository.findOne({ where: { id } });
    return appointment ? new Appointment(appointment as any) : null;
  }

  async create(appointment: Partial<Appointment>): Promise<Appointment> {
    const newAppointment = this.repository.create(appointment);
    await this.repository.save(newAppointment);
    return new Appointment(newAppointment as any);
  }

  async update(id: string, appointment: Partial<Appointment>): Promise<Appointment> {
    await this.repository.update(id, appointment);
    const updated = await this.findById(id);
    return updated!;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
