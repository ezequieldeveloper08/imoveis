import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { IWhatsappProvider } from '../../domain/providers/whatsapp.provider';
import { IWHATSAPP_PROVIDER } from '../../domain/providers/whatsapp.provider';
import { IWHATSAPP_REPOSITORY } from '../../domain/repositories/whatsapp.repository';
import type { IWhatsappRepository } from '../../domain/repositories/whatsapp.repository';
import { WhatsappStatus } from '../../domain/entities/whatsapp-config.entity';

@Injectable()
export class InstanceService {
  private readonly logger = new Logger(InstanceService.name);

  constructor(
    @Inject(IWHATSAPP_PROVIDER)
    private readonly provider: IWhatsappProvider,
    @Inject(IWHATSAPP_REPOSITORY)
    private readonly repository: IWhatsappRepository,
    private readonly configService: ConfigService,
  ) {}

  async listInstances(organizationId: string) {
    // 1. Get our DB config (only one per organization now)
    let config = await this.repository.findByOrganization(organizationId).then(configs => configs[0]);
    
    if (!config) return [];

    const instanceName = config.organizationId.toLowerCase();
    
    // 2. Fetch from provider to see if it exists there
    const providerInstances = await this.provider.listInstances();
    this.logger.debug(`Searching for instance: "${instanceName}". Available in provider: ${providerInstances.map(p => `"${p.name}"`).join(', ')}`);
    
    const providerInstance = providerInstances.find(pi => 
      pi.name && pi.name.toLowerCase() === instanceName
    );

    if (!providerInstance) {
      // Instance exists in our DB but not in provider (maybe deleted manually)
      this.logger.warn(`Instance ${config.instanceName} not found in provider. Deleting from local DB.`);
      await this.repository.delete(config.id);
      return [];
    }

    // 3. Sync status if needed
    const isConnected = providerInstance.status === 'open' || providerInstance.status === 'CONNECTED';
    const newStatus = isConnected ? WhatsappStatus.CONNECTED : WhatsappStatus.DISCONNECTED;
    
    if (config.status !== newStatus) {
      this.logger.log(`Syncing status for ${instanceName}: ${config.status} -> ${newStatus}`);
      config.status = newStatus;
      await this.repository.save(config as any);
    }

    // 4. Auto-sync webhook if connected but no URL recorded
    const defaultWebhookUrl = this.configService.get<string>('APP_WEBHOOK_URL') || 'http://localhost:3001/whatsapp/webhook';
    if (isConnected && !config.webhookUrl) {
      this.logger.log(`Auto-syncing webhook for ${instanceName}`);
      try {
        await this.provider.setWebhooks(instanceName, defaultWebhookUrl);
        config.webhookUrl = defaultWebhookUrl;
        await this.repository.save(config as any);
      } catch (error) {
        this.logger.error(`Failed to auto-sync webhook: ${error.message}`);
      }
    }

    // 5. Fetch real-time webhook config from provider
    let webhookEvents = config.aiSettings?.webhookEvents || [];
    if (isConnected) {
      const remoteWebhook = await (this.provider as any).getWebhooks?.(instanceName);
      if (remoteWebhook && Array.isArray(remoteWebhook)) {
        // v2 returns an array of webhooks, we take the one matching our URL or just the first one
        const activeHook = remoteWebhook.find((h: any) => h.url === defaultWebhookUrl) || remoteWebhook[0];
        if (activeHook) {
          webhookEvents = activeHook.events || [];
        }
      }
    }

    return [{
      ...providerInstance,
      id: config.id,
      status: isConnected ? 'CONNECTED' : 'DISCONNECTED',
      connectionStatus: isConnected ? 'open' : 'close',
      webhookUrl: config.webhookUrl,
      webhookEvents: webhookEvents,
      isAiEnabled: config.isAiEnabled,
    }];
  }

  async createInstance(organizationId: string, name?: string) {
    // Name is now always organizationId (lowercased)
    const instanceName = organizationId.toLowerCase();
    
    // 1. Check if already exists in DB
    let config = await this.repository.findByOrganization(organizationId).then(configs => configs[0]);
    
    if (config && config.status === WhatsappStatus.CONNECTED) {
      throw new Error('Esta organização já possui uma instância ativa.');
    }

    // 2. Create in provider
    const result = await this.provider.createInstance(instanceName);
    
    // 3. Save or Update in our DB
    if (config) {
      config.instanceName = instanceName;
      config.status = WhatsappStatus.PENDING;
      await this.repository.save(config as any);
    } else {
      await this.repository.save({
        organizationId,
        instanceName,
        status: WhatsappStatus.PENDING,
        provider: 'evolution',
      } as any);
    }

    return result;
  }

  async getQrCode(name: string) {
    return this.provider.getQrCode(name);
  }

  async logout(name: string) {
    return this.provider.logout(name);
  }

  async delete(name: string) {
    const instanceName = name.toLowerCase();
    // 1. Delete from provider
    try {
      await this.provider.deleteInstance(instanceName);
    } catch (error) {
      this.logger.error(`Failed to delete instance from provider: ${error.message}`);
    }

    // 2. Delete from our DB
    const configs = await this.repository.findByOrganization(name); // name is organizationId
    for (const config of configs) {
      await this.repository.delete(config.id);
    }
  }

  async sendMessage(instanceName: string, to: string, text: string) {
    return this.provider.sendMessage(instanceName, to, text);
  }

  async sendMedia(instanceName: string, to: string, mediaUrl: string, caption?: string, mediaType?: 'image' | 'video' | 'document') {
    return this.provider.sendMedia(instanceName, to, mediaUrl, caption, mediaType);
  }

  async updateWebhookConfig(organizationId: string, events: string[]) {
    const defaultUrl = this.configService.get<string>('APP_WEBHOOK_URL') || 'http://localhost:3001/whatsapp/webhook';
    this.logger.log(`Updating webhook config for organization ${organizationId} with events: ${events.join(', ')}`);
    
    const configs = await this.repository.findByOrganization(organizationId);
    for (const config of configs) {
      const instanceName = config.instanceName?.toLowerCase();
      // 1. Update in provider
      if (instanceName) {
        try {
          await this.provider.setWebhooks(instanceName, defaultUrl, events);
          
          // 2. Update DB with selected events (saving in metadata for now or AI settings)
          await this.repository.save({
            ...config,
            webhookUrl: defaultUrl,
            aiSettings: { ...config.aiSettings, webhookEvents: events }
          } as any);
        } catch (error) {
          this.logger.error(`Failed to set webhook for instance ${config.instanceName}: ${error.message}`);
        }
      }
    }

    return { success: true };
  }
}
