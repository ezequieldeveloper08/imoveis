import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DepartmentService } from '../../application/services/department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from '../dtos/department.dto';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';

@ApiTags('departments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create department' })
  create(@Body() createDepartmentDto: CreateDepartmentDto, @Request() req) {
    return this.departmentService.create({
      ...createDepartmentDto,
      organizationId: req.user.organizationId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all departments' })
  findAll(@Request() req) {
    return this.departmentService.findAll(req.user.organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get department by id' })
  findOne(@Param('id') id: string) {
    return this.departmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update department' })
  update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete department' })
  remove(@Param('id') id: string) {
    return this.departmentService.remove(id);
  }
}
