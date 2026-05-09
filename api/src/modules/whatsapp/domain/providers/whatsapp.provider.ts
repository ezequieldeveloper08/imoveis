export interface WhatsappProviderInstance {
  name: string;
  status: string;
  profileName?: string;
  ownerJid?: string;
  profilePicUrl?: string;
}

export interface IWhatsappProvider {
  createInstance(name: string): Promise<any>;
  listInstances(): Promise<WhatsappProviderInstance[]>;
  getQrCode(name: string): Promise<{ base64?: string; code?: string }>;
  logout(name: string): Promise<void>;
  deleteInstance(name: string): Promise<void>;
  sendMessage(instanceName: string, number: string, text: string): Promise<any>;
  sendMedia(instanceName: string, number: string, mediaUrl: string, caption?: string, mediaType?: 'image' | 'video' | 'document'): Promise<any>;
  setWebhooks(name: string, url: string, events?: string[]): Promise<void>;
  getWebhooks(name: string): Promise<any>;
}

export const IWHATSAPP_PROVIDER = 'IWHATSAPP_PROVIDER';
