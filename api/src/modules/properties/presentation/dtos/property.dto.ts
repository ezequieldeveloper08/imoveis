import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, IsArray } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Modern Villa' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'A beautiful modern villa in the suburbs' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 500000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'house' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'sale' })
  @IsString()
  @IsNotEmpty()
  listingType: string;

  @ApiProperty({ example: 'AVAILABLE' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @ApiProperty()
  @IsNumber()
  bedrooms: number;

  @ApiProperty()
  @IsNumber()
  bathrooms: number;

  @ApiProperty()
  @IsNumber()
  garages: number;

  @ApiProperty()
  @IsNumber()
  area: number;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  amenities?: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  images?: string[];
}

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {}
