import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class EvolutionClient {
  private readonly logger = new Logger(EvolutionClient.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.baseUrl = this.configService.get<string>('EVOLUTION_BASE_URL') || '';
    this.apiKey = this.configService.get<string>('EVOLUTION_GLOBAL_API_KEY') || '';
  }

  private get headers() {
    return {
      apikey: this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  async createInstance(instanceName: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.baseUrl}/instance/create`,
          {
            instanceName,
            qrcode: true,
            integration: 'WHATSAPP-BAILEYS',
          },
          { headers: this.headers },
        ),
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data;
      this.logger.error(`Error creating instance: ${error.message} - API Response: ${JSON.stringify(apiError)}`);
      throw new InternalServerErrorException(apiError?.message || 'Failed to create WhatsApp instance');
    }
  }

  async fetchInstances() {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}/instance/fetchInstances`, {
          headers: this.headers,
        }),
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data;
      this.logger.error(`Error fetching instances: ${error.message} - API Response: ${JSON.stringify(apiError)}`);
      throw new InternalServerErrorException(apiError?.message || 'Failed to fetch WhatsApp instances');
    }
  }

  async getQrCode(instanceName: string) {
    const url = `${this.baseUrl}/instance/connect/${instanceName}`;
    this.logger.debug(`[EvolutionClient] Fetching QR Code from: ${url}`);
    this.logger.debug(`[EvolutionClient] Using API Key: ${this.apiKey.substring(0, 5)}...`);

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: this.headers,
        }),
      );
      
      this.logger.log(`[EvolutionClient] QR Code response status: ${response.status}`);
      if (response.data?.base64) {
        this.logger.log(`[EvolutionClient] QR Code Base64 received (length: ${response.data.base64.length})`);
      } else {
        this.logger.warn(`[EvolutionClient] QR Code response received but no base64 found: ${JSON.stringify(response.data)}`);
      }

      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data;
      this.logger.error(`[EvolutionClient] Error fetching QR Code: ${error.message} - API Response: ${JSON.stringify(apiError)}`);
      throw new InternalServerErrorException(apiError?.message || 'Failed to fetch WhatsApp QR Code');
    }
  }

  async logoutInstance(instanceName: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.baseUrl}/instance/logout/${instanceName}`,
          {},
          { headers: this.headers },
        ),
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data;
      this.logger.error(`Error logging out instance: ${error.message} - API Response: ${JSON.stringify(apiError)}`);
      throw new InternalServerErrorException(apiError?.message || 'Failed to logout WhatsApp instance');
    }
  }

  async deleteInstance(instanceName: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.delete(`${this.baseUrl}/instance/delete/${instanceName}`, {
          headers: this.headers,
        }),
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data;
      this.logger.error(`Error deleting instance: ${error.message} - API Response: ${JSON.stringify(apiError)}`);
      throw new InternalServerErrorException(apiError?.message || 'Failed to delete WhatsApp instance');
    }
  }

  async sendMessage(instanceName: string, number: string, text: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.baseUrl}/message/sendText/${instanceName}`,
          {
            number,
            text,
            delay: 1200,
            linkPreview: false,
          },
          { headers: this.headers },
        ),
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data;
      this.logger.error(`Error sending message: ${error.message} - API Response: ${JSON.stringify(apiError)}`);
      throw new InternalServerErrorException(apiError?.message || 'Failed to send WhatsApp message');
    }
  }

  async sendMedia(instanceName: string, number: string, mediaUrl: string, caption?: string, mediaType: 'image' | 'video' | 'document' = 'image') {
    try {
      this.logger.log(`[Evolution] Processing media for ${number}. URL: ${mediaUrl}`);
      
      let mediaData = mediaUrl;

      // If it's a URL and potentially local or needs base64 conversion
      if (mediaUrl && mediaUrl.startsWith('http')) {
        try {
          const response = await lastValueFrom(
            this.httpService.get(mediaUrl, { responseType: 'arraybuffer' })
          );
          const base64 = Buffer.from(response.data).toString('base64');
          mediaData = base64; 
          this.logger.log(`[Evolution] Media converted to pure base64 successfully (Buffer length: ${base64.length})`);
        } catch (fetchError) {
          this.logger.error(`[Evolution] Failed to fetch media for base64 conversion: ${fetchError.message}`);
        }
      }

      const response = await lastValueFrom(
        this.httpService.post(
          `${this.baseUrl}/message/sendMedia/${instanceName}`,
          {
            number,
            media: mediaData,
            mediatype: mediaType,
            mimetype: 'image/webp',
            caption,
            fileName: 'imovel.jpg',
            delay: 1200,
          },
          { headers: this.headers },
        ),
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data;
      this.logger.error(`Error sending media to ${number}: ${error.message} - API Response: ${JSON.stringify(apiError)}`);
      throw new InternalServerErrorException(apiError?.message || 'Failed to send WhatsApp media');
    }
  }

  async setWebhooks(instanceName: string, url: string, events?: string[]) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.baseUrl}/webhook/set/${instanceName}`,
          {
            webhook: {
              url,
              enabled: true,
              webhook_by_events: false,
              events: events || [
                'MESSAGES_UPSERT',
                'MESSAGES_UPDATE',
                'MESSAGES_SET',
                'SEND_MESSAGE',
                'CONNECTION_UPDATE',
                'QRCODE_UPDATED',
              ],
            }
          },
          { headers: this.headers },
        ),
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data;
      this.logger.error(`Error setting webhooks: ${error.message} - API Response: ${JSON.stringify(apiError)}`);
      throw new InternalServerErrorException(apiError?.message || 'Failed to set WhatsApp webhooks');
    }
  }

  async getWebhooks(instanceName: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}/webhook/find/${instanceName}`, {
          headers: this.headers,
        }),
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data;
      this.logger.error(`Error fetching webhooks: ${error.message} - API Response: ${JSON.stringify(apiError)}`);
      return null;
    }
  }
}
