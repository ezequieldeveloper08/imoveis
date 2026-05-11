import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentService } from '../../application/services/appointment.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from '../dtos/appointment.dto';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';

@ApiTags('appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create appointment' })
  create(@Body() createAppointmentDto: CreateAppointmentDto, @Request() req) {
    console.log('[API] Received createAppointmentDto:', createAppointmentDto);
    return this.appointmentService.create({
      ...createAppointmentDto,
      organizationId: req.user.organizationId,
    } as any);
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  findAll(@Request() req, @Query('propertyId') propertyId?: string, @Query('leadId') leadId?: string) {
    return this.appointmentService.findAll(req.user.organizationId, propertyId, leadId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by id' })
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update appointment' })
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentService.update(id, updateAppointmentDto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete appointment' })
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(id);
  }
}
