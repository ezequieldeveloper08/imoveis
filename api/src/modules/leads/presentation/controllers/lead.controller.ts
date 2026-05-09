import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LeadService } from '../../application/services/lead.service';
import { CreateLeadDto, UpdateLeadDto } from '../dtos/lead.dto';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';

@ApiTags('leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) { }

  @Post()
  @ApiOperation({ summary: 'Create lead' })
  create(@Body() createLeadDto: CreateLeadDto, @Request() req) {
    return this.leadService.create({
      ...createLeadDto,
      organizationId: req.user.organizationId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all leads from organization' })
  findAll(
    @Request() req, 
    @Query('propertyId') propertyId?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
    @Query('contactId') contactId?: string
  ) {
    return this.leadService.findAll(req.user.organizationId, propertyId, email, phone, contactId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead by id' })
  findOne(@Param('id') id: string) {
    return this.leadService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update lead' })
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadService.update(id, updateLeadDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lead' })
  remove(@Param('id') id: string) {
    return this.leadService.remove(id);
  }
}
