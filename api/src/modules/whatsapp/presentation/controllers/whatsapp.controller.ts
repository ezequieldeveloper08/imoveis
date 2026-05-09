import { Controller, Get, Post, Body, HttpCode, HttpStatus, Inject, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProcessWebhookUseCase } from '../../application/use-cases/process-webhook.use-case';
import { IWHATSAPP_REPOSITORY } from '../../domain/repositories/whatsapp.repository';
import type { IWhatsappRepository } from '../../domain/repositories/whatsapp.repository';
import { WhatsappConfig, WhatsappStatus } from '../../domain/entities/whatsapp-config.entity';
import { InstanceService } from '../../application/services/instance.service';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('whatsapp')
@ApiBearerAuth()
@Controller('whatsapp')
export class WhatsappController {
  constructor(
    private readonly processWebhookUseCase: ProcessWebhookUseCase,
    @Inject(IWHATSAPP_REPOSITORY)
    private readonly whatsappRepository: IWhatsappRepository,
    private readonly instanceService: InstanceService,
  ) {}

  /**
   * INSTANCE MANAGEMENT
   */

  @UseGuards(JwtAuthGuard)
  @Get('instances')
  @ApiOperation({ summary: 'List WhatsApp instances' })
  async listInstances(@Request() req) {
    return this.instanceService.listInstances(req.user.organizationId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('instances')
  @ApiOperation({ summary: 'Create a new WhatsApp instance' })
  async createInstance(@Body('name') name: string | undefined, @Request() req) {
    return this.instanceService.createInstance(req.user.organizationId, name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('qr/:instanceName')
  async getQrCode(@Param('instanceName') instanceName: string) {
    return this.instanceService.getQrCode(instanceName);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout/:instanceName')
  async logout(@Param('instanceName') instanceName: string) {
    return this.instanceService.logout(instanceName);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('instances/:instanceName')
  async deleteInstance(@Param('instanceName') instanceName: string) {
    return this.instanceService.delete(instanceName);
  }

  /**
   * MESSAGES
   */

  @UseGuards(JwtAuthGuard)
  @Post('send')
  async sendMessage(
    @Body('instanceName') instanceName: string,
    @Body('to') to: string,
    @Body('text') text: string,
  ) {
    return this.instanceService.sendMessage(instanceName, to, text);
  }

  /**
   * WEBHOOKS
   */

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() payload: any) {
    // console.log('Incoming Evolution Webhook Payload:', JSON.stringify(payload, null, 2));
    return await this.processWebhookUseCase.execute(payload);
  }

  /**
   * LEGACY CONFIG (Keep for compatibility if needed)
   */
  @UseGuards(JwtAuthGuard)
  @Post('config')
  async saveConfig(@Body() configData: Partial<WhatsappConfig>) {
    const config = new WhatsappConfig(configData);
    config.status = WhatsappStatus.CONNECTED;
    return await this.whatsappRepository.save(config);
  }

  @UseGuards(JwtAuthGuard)
  @Post('webhook-config')
  @ApiOperation({ summary: 'Set webhook events for all instances' })
  async setWebhook(@Body('events') events: string[], @Request() req) {
    return this.instanceService.updateWebhookConfig(req.user.organizationId, events);
  }
}
