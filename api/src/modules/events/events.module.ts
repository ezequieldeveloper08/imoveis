import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from './application/services/event.service';
import { EventController } from './presentation/controllers/event.controller';
import { EventRepository } from './domain/repositories/event.repository';
import { TypeOrmEventRepository } from './infrastructure/repositories/typeorm-event.repository';
import { EventSchema } from './infrastructure/repositories/event.schema';

@Module({
  imports: [TypeOrmModule.forFeature([EventSchema])],
  controllers: [EventController],
  providers: [
    EventService,
    {
      provide: EventRepository,
      useClass: TypeOrmEventRepository,
    },
  ],
  exports: [EventService, EventRepository],
})
export class EventModule {}
