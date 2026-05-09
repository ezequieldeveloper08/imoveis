import { Event } from '../entities/event.entity';

export abstract class EventRepository {
  abstract findByOrganization(orgId: string): Promise<Event[]>;
  abstract findByUser(userId: string): Promise<Event[]>;
  abstract findById(id: string): Promise<Event | null>;
  abstract create(event: Partial<Event>): Promise<Event>;
  abstract update(id: string, event: Partial<Event>): Promise<Event>;
  abstract delete(id: string): Promise<void>;
}
