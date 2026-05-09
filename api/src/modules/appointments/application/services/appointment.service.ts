import { Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentRepository } from '../../domain/repositories/appointment.repository';
import { Appointment } from '../../domain/entities/appointment.entity';

import { LeadRepository } from '../../../leads/domain/repositories/lead.repository';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly repository: AppointmentRepository,
    private readonly leadRepository: LeadRepository,
  ) {}

  async findAll(orgId: string, propertyId?: string, leadId?: string) {
    if (propertyId) {
      return this.repository.findByProperty(propertyId);
    }
    if (leadId) {
      return this.repository.findByLead(leadId);
    }
    return this.repository.findByOrganization(orgId);
  }

  async findOne(id: string) {
    const appointment = await this.repository.findById(id);
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async create(data: Partial<Appointment>) {
    const appointment = await this.repository.create(data);

    // Auto-update lead status to 'visit'
    if (appointment.leadId) {
      await this.leadRepository.update(appointment.leadId, { status: 'visit' } as any);
    }

    return appointment;
  }

  async update(id: string, data: Partial<Appointment>) {
    await this.findOne(id);
    return this.repository.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}
