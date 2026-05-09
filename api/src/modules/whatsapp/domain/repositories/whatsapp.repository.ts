import { WhatsappConfig } from '../entities/whatsapp-config.entity';

export interface IWhatsappRepository {
  findByBusinessId(businessId: string): Promise<WhatsappConfig | null>;
  findByPhoneNumberId(phoneNumberId: string): Promise<WhatsappConfig | null>;
  save(config: WhatsappConfig): Promise<WhatsappConfig>;
  updateStatus(id: string, status: string): Promise<void>;
}

export const IWHATSAPP_REPOSITORY = 'IWHATSAPP_REPOSITORY';
