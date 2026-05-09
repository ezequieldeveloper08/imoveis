import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'Visit at Malibu Villa' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Meeting with lead to discuss pricing' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2026-05-10T10:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  startTime: Date;

  @ApiProperty({ example: '2026-05-10T11:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  endTime: Date;

  @ApiProperty({ example: 'uuid-lead' })
  @IsString()
  @IsOptional()
  leadId?: string;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}
