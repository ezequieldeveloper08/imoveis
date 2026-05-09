import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EventService } from '../../application/services/event.service';
import { CreateEventDto, UpdateEventDto } from '../dtos/event.dto';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';

@ApiTags('events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) { }

  @Post()
  @ApiOperation({ summary: 'Create event' })
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventService.create({
      ...createEventDto,
      userId: req.user.userId,
      organizationId: req.user.organizationId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all events from organization' })
  findAll(@Request() req) {
    return this.eventService.findByOrganization(req.user.organizationId);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my events' })
  findMe(@Request() req) {
    return this.eventService.findByUser(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by id' })
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update event' })
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete event' })
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }
}
