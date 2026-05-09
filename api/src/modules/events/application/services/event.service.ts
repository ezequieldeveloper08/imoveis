import { Injectable, NotFoundException } from '@nestjs/common';
import { EventRepository } from '../../domain/repositories/event.repository';
import { Event } from '../../domain/entities/event.entity';

@Injectable()
export class EventService {
  constructor(private readonly repository: EventRepository) { }

  async findByOrganization(orgId: string) {
    return this.repository.findByOrganization(orgId);
  }

  async findByUser(userId: string) {
    return this.repository.findByUser(userId);
  }

  async findOne(id: string) {
    const event = await this.repository.findById(id);
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async create(data: Partial<Event>) {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<Event>) {
    await this.findOne(id);
    return this.repository.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}
