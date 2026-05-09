import { Appointment } from '../entities/appointment.entity';

export abstract class AppointmentRepository {
  abstract findByProperty(propertyId: string): Promise<Appointment[]>;
  abstract findByLead(leadId: string): Promise<Appointment[]>;
  abstract findByOrganization(orgId: string): Promise<Appointment[]>;
  abstract findById(id: string): Promise<Appointment | null>;
  abstract create(appointment: Partial<Appointment>): Promise<Appointment>;
  abstract update(id: string, appointment: Partial<Appointment>): Promise<Appointment>;
  abstract delete(id: string): Promise<void>;
}
