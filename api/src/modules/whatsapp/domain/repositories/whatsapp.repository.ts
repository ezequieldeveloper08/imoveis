import { WhatsappConfig } from '../entities/whatsapp-config.entity';

export interface IWhatsappRepository {
  findByBusinessId(businessId: string): Promise<WhatsappConfig | null>;
  findByPhoneNumberId(phoneNumberId: string): Promise<WhatsappConfig | null>;
  findOneByInstance(instanceName: string): Promise<WhatsappConfig | null>;
  findByOrganization(organizationId: string): Promise<WhatsappConfig[]>;
  save(config: WhatsappConfig): Promise<WhatsappConfig>;
  updateStatus(id: string, status: string): Promise<void>;
  delete(id: string): Promise<void>;
}

export const IWHATSAPP_REPOSITORY = 'IWHATSAPP_REPOSITORY';
