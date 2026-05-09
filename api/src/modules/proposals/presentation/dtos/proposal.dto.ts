import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateProposalDto {
  @ApiProperty({ example: 500000 })
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @ApiProperty({ example: '2024-05-08' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  leadId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  propertyId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status?: string;
}

export class UpdateProposalDto extends PartialType(CreateProposalDto) {}
