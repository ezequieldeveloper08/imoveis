import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiProperty({ example: 'uuid-lead' })
  @IsString()
  @IsNotEmpty()
  leadId: string;
}

export class CreateMessageDto {
  @ApiProperty({ example: 'Hello, I am interested in the property!' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
