import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { ProcessWebhookUseCase } from '../../application/use-cases/process-webhook.use-case';
import { IWHATSAPP_REPOSITORY } from '../../domain/repositories/whatsapp.repository';
import type { IWhatsappRepository } from '../../domain/repositories/whatsapp.repository';
import { WhatsappConfig, WhatsappStatus } from '../../domain/entities/whatsapp-config.entity';

@Controller('whatsapp')
export class WhatsappController {
  constructor(
    private readonly processWebhookUseCase: ProcessWebhookUseCase,
    @Inject(IWHATSAPP_REPOSITORY)
    private readonly whatsappRepository: IWhatsappRepository,
  ) {}

  /**
   * GET /whatsapp/webhook
   * Endpoint for Meta to verify the webhook URL (Handshake)
   */
  @Get('webhook')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    // In production, compare with the token stored in config or env
    const VERIFY_TOKEN = 'simovel_secure_token_2024';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      return challenge;
    }

    return 'Verification failed';
  }

  /**
   * POST /whatsapp/webhook
   * Endpoint to receive incoming messages from Meta
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() payload: any) {
    console.log('Incoming WhatsApp Webhook Payload:', JSON.stringify(payload, null, 2));
    return await this.processWebhookUseCase.execute(payload);
  }

  /**
   * POST /whatsapp/config
   * Endpoint to save or update WABA configuration
   */
  @Post('config')
  async saveConfig(@Body() configData: Partial<WhatsappConfig>) {
    // In a real app, you would find the existing config for the account/user
    const config = new WhatsappConfig();
    Object.assign(config, configData);
    config.status = WhatsappStatus.CONNECTED;
    
    return await this.whatsappRepository.save(config);
  }

  /**
   * GET /whatsapp/status
   * Check connection status
   */
  @Get('status')
  async getStatus() {
    // Mocking status for UI demo
    return {
      status: 'connected',
      phoneNumber: '+55 11 98888-7777',
      wabaName: 'Simovel Imobiliária Principal',
      aiActive: true,
    };
  }
}
