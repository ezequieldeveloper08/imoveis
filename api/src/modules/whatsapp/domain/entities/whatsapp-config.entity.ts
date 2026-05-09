export enum WhatsappStatus {
  DISCONNECTED = 'disconnected',
  PENDING = 'pending',
  CONNECTED = 'connected',
  ERROR = 'error',
}

export class WhatsappConfig {
  id: string;
  businessId?: string;
  phoneNumberId?: string;
  accessToken?: string;
  verifyToken?: string;
  phoneNumber?: string;
  status: WhatsappStatus;
  webhookUrl?: string;
  isAiEnabled: boolean;
  aiSettings?: any;
  organizationId: string;
  provider: string;
  instanceName?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<WhatsappConfig>) {
    Object.assign(this, partial);
  }
}
