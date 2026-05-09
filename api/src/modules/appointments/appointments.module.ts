import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentSchema } from './infrastructure/repositories/appointment.schema';
import { AppointmentRepository } from './domain/repositories/appointment.repository';
import { TypeOrmAppointmentRepository } from './infrastructure/repositories/typeorm-appointment.repository';

import { AppointmentService } from './application/services/appointment.service';
import { AppointmentController } from './presentation/controllers/appointment.controller';

import { LeadModule } from '../leads/leads.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppointmentSchema]),
    LeadModule
  ],
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    {
      provide: AppointmentRepository,
      useClass: TypeOrmAppointmentRepository,
    },
  ],
  exports: [AppointmentRepository, AppointmentService],
})
export class AppointmentsModule {}
