import { Injectable } from '@nestjs/common';
import { IWhatsappProvider, WhatsappProviderInstance } from '../../domain/providers/whatsapp.provider';
import { EvolutionClient } from '../services/evolution.client';

@Injectable()
export class EvolutionProvider implements IWhatsappProvider {
  constructor(private readonly evolutionClient: EvolutionClient) {}

  async createInstance(name: string): Promise<any> {
    return this.evolutionClient.createInstance(name);
  }

  async listInstances(): Promise<WhatsappProviderInstance[]> {
    const data = await this.evolutionClient.fetchInstances();
    
    // Ensure data is an array (sometimes Evolution API returns { instances: [] } or similar)
    const instancesArray = Array.isArray(data) ? data : (data?.instances || data?.data || []);
    
    // Map Evolution response to common interface
    return instancesArray.map((item: any) => ({
      name: item.instanceName || item.name || item.instance,
      status: item.status || item.connectionStatus || item.state,
      profileName: item.profileName,
      ownerJid: item.ownerJid,
      profilePicUrl: item.profilePictureUrl || item.profilePicUrl,
    }));
  }

  async getQrCode(name: string): Promise<{ base64?: string; code?: string }> {
    const data = await this.evolutionClient.getQrCode(name);
    return {
      base64: data.base64,
      code: data.code,
    };
  }

  async logout(name: string): Promise<void> {
    await this.evolutionClient.logoutInstance(name);
  }

  async deleteInstance(name: string): Promise<void> {
    await this.evolutionClient.deleteInstance(name);
  }

  async sendMessage(instanceName: string, number: string, text: string): Promise<any> {
    return this.evolutionClient.sendMessage(instanceName, number, text);
  }

  async sendMedia(instanceName: string, number: string, mediaUrl: string, caption?: string, mediaType?: 'image' | 'video' | 'document'): Promise<any> {
    return this.evolutionClient.sendMedia(instanceName, number, mediaUrl, caption, mediaType);
  }

  async setWebhooks(name: string, url: string, events?: string[]): Promise<void> {
    await this.evolutionClient.setWebhooks(name, url, events);
  }

  async getWebhooks(name: string): Promise<any> {
    return this.evolutionClient.getWebhooks(name);
  }
}
