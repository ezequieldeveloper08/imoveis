import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateLeadDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+5511999999999' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'NEW' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 'Website' })
  @IsString()
  @IsOptional()
  source?: string;

  @ApiProperty({ example: 'uuid-of-property' })
  @IsString()
  @IsOptional()
  propertyId?: string;

  @ApiProperty({ example: 'Casa no Morumbi' })
  @IsString()
  @IsOptional()
  interest?: string;

  @ApiProperty({ example: 'Cliente busca permuta' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: 'Preço muito alto' })
  @IsString()
  @IsOptional()
  lostReason?: string;

  @ApiProperty({ example: 500000 })
  @IsOptional()
  value?: number;
}

export class UpdateLeadDto extends PartialType(CreateLeadDto) {}
