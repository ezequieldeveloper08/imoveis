import { apiClient } from '@/infrastructure/api/api-client';

export interface WhatsappInstance {
  id: string;
  name: string;
  connectionStatus: 'open' | 'connecting' | 'disconnected' | 'close' | 'refused';
  ownerJid?: string;
  profileName?: string;
  profilePicUrl?: string;
  number?: string;
  webhookUrl?: string;
  webhookEvents?: string[];
}

export const whatsappService = {
  getInstances: (token?: string) => 
    apiClient<WhatsappInstance[]>('/whatsapp/instances', { token }),

  createInstance: (name: string, token?: string) => 
    apiClient('/whatsapp/instances', { 
      method: 'POST', 
      body: { name }, 
      token 
    }),

  getQrCode: (instanceName: string, token?: string) => 
    apiClient<any>(`/whatsapp/qr/${instanceName}`, { token }),

  logout: (instanceName: string, token?: string) => 
    apiClient(`/whatsapp/logout/${instanceName}`, { 
      method: 'POST', 
      token 
    }),

  deleteInstance: (instanceName: string, token?: string) => 
    apiClient(`/whatsapp/instances/${instanceName}`, { 
      method: 'DELETE', 
      token 
    }),

  setWebhookConfig: (events: string[], token?: string) =>
    apiClient('/whatsapp/webhook-config', {
      method: 'POST',
      body: { events },
      token
    }),
};
