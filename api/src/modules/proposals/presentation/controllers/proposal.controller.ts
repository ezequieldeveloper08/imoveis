import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProposalService } from '../../application/services/proposal.service';
import { CreateProposalDto, UpdateProposalDto } from '../dtos/proposal.dto';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';

@ApiTags('proposals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('proposals')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Post()
  @ApiOperation({ summary: 'Create proposal' })
  create(@Body() createProposalDto: CreateProposalDto, @Request() req) {
    return this.proposalService.create({
      ...createProposalDto,
      organizationId: req.user.organizationId,
    } as any);
  }

  @Get()
  @ApiOperation({ summary: 'Get all proposals' })
  findAll(@Request() req, @Query('propertyId') propertyId?: string, @Query('leadId') leadId?: string) {
    return this.proposalService.findAll(req.user.organizationId, propertyId, leadId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get proposal by id' })
  findOne(@Param('id') id: string) {
    return this.proposalService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update proposal' })
  update(@Param('id') id: string, @Body() updateProposalDto: UpdateProposalDto) {
    return this.proposalService.update(id, updateProposalDto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete proposal' })
  remove(@Param('id') id: string) {
    return this.proposalService.remove(id);
  }
}
