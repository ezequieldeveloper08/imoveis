import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../../application/services/auth.service';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { UserRepository } from '../../domain/repositories/user.repository';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create user in organization' })
  create(@Body() createUserDto: CreateUserDto, @Request() req) {
    return this.authService.addUserToOrganization({
      ...createUserDto,
      organizationId: req.user.organizationId,
      status: createUserDto.status || 'active',
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all users in organization' })
  findAll(@Request() req) {
    return this.userRepository.findByOrganization(req.user.organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  async findOne(@Param('id') id: string) {
    // Note: should check if user belongs to same organization
    return this.userRepository.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  remove(@Param('id') id: string) {
    return this.userRepository.delete(id);
  }
}
