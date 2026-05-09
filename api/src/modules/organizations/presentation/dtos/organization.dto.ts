import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'My Real Estate Agency' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {}
