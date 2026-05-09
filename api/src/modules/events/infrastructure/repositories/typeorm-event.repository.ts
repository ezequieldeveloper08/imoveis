import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventRepository } from '../../domain/repositories/event.repository';
import { Event } from '../../domain/entities/event.entity';
import { EventSchema } from './event.schema';

@Injectable()
export class TypeOrmEventRepository implements EventRepository {
  constructor(
    @InjectRepository(EventSchema)
    private readonly repository: Repository<EventSchema>,
  ) {}

  async findByOrganization(orgId: string): Promise<Event[]> {
    const events = await this.repository.find({ where: { organizationId: orgId } });
    return events.map(event => new Event(event));
  }

  async findByUser(userId: string): Promise<Event[]> {
    const events = await this.repository.find({ where: { userId } });
    return events.map(event => new Event(event));
  }

  async findById(id: string): Promise<Event | null> {
    const event = await this.repository.findOne({ where: { id } });
    return event ? new Event(event) : null;
  }

  async create(event: Partial<Event>): Promise<Event> {
    const newEvent = this.repository.create(event);
    await this.repository.save(newEvent);
    return new Event(newEvent);
  }

  async update(id: string, event: Partial<Event>): Promise<Event> {
    await this.repository.update(id, event);
    const updated = await this.findById(id);
    return updated!;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
