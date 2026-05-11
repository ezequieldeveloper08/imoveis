import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  propertyId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  leadId?: string;

  @ApiProperty({ example: '2024-05-08T10:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 'SCHEDULED' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {}
