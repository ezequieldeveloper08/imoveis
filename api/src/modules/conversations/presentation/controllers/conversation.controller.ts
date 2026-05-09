import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConversationService } from '../../application/services/conversation.service';
import { CreateConversationDto, CreateMessageDto } from '../dtos/conversation.dto';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';

@ApiTags('conversations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  @ApiOperation({ summary: 'Start a new conversation' })
  create(@Body() createDto: CreateConversationDto, @Request() req) {
    return this.conversationService.create({
      ...createDto,
      userId: req.user.userId,
      organizationId: req.user.organizationId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all conversations from organization' })
  findAll(@Request() req) {
    return this.conversationService.findByOrganization(req.user.organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get conversation by id' })
  findOne(@Param('id') id: string) {
    return this.conversationService.findOne(id);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Add message to conversation' })
  addMessage(@Param('id') id: string, @Body() body: { content: string, mediaUrl?: string, mediaType?: 'image' | 'video' | 'document' }, @Request() req) {
    return this.conversationService.addMessage(id, req.user.userId, body.content, { 
      mediaUrl: body.mediaUrl, 
      mediaType: body.mediaType 
    });
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get messages from conversation' })
  findMessages(@Param('id') id: string) {
    return this.conversationService.findMessages(id);
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark conversation as read' })
  markAsRead(@Param('id') id: string, @Request() req) {
    return this.conversationService.markAsRead(id, req.user.organizationId);
  }
}
