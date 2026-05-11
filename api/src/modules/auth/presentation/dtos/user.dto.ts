import { IsString, IsNotEmpty, IsOptional, IsEnum, MinLength } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: ['ADMIN', 'AGENT', 'MANAGER'] })
  @IsEnum(['ADMIN', 'AGENT', 'MANAGER'])
  role: 'ADMIN' | 'AGENT' | 'MANAGER';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiProperty({ required: false, enum: ['active', 'inactive'] })
  @IsEnum(['active', 'inactive'])
  @IsOptional()
  status?: 'active' | 'inactive';
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
