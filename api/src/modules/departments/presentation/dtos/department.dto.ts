import { IsString, IsNotEmpty, IsOptional, IsHexColor, IsUUID } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  managerId?: string;

  @ApiProperty({ required: false })
  @IsHexColor()
  @IsOptional()
  color?: string;
}

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
