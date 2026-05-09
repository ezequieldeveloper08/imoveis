import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IWhatsappRepository } from '../../domain/repositories/whatsapp.repository';
import { WhatsappConfigSchema, WhatsappStatus } from '../repositories/whatsapp.schema';
import { WhatsappConfig } from '../../domain/entities/whatsapp-config.entity';

@Injectable()
export class WhatsappRepository implements IWhatsappRepository {
  constructor(
    @InjectRepository(WhatsappConfigSchema)
    private readonly repository: Repository<WhatsappConfigSchema>,
  ) {}

  async findByBusinessId(businessId: string): Promise<WhatsappConfig | null> {
    const res = await this.repository.findOne({ where: { businessId } });
    return res ? new WhatsappConfig(res) : null;
  }

  async findByPhoneNumberId(phoneNumberId: string): Promise<WhatsappConfig | null> {
    const res = await this.repository.findOne({ where: { phoneNumberId } });
    return res ? new WhatsappConfig(res) : null;
  }

  async findOneByInstance(instanceName: string): Promise<WhatsappConfig | null> {
    const res = await this.repository.findOne({ where: { instanceName } });
    return res ? new WhatsappConfig(res) : null;
  }

  async findByOrganization(organizationId: string): Promise<WhatsappConfig[]> {
    const res = await this.repository.find({ where: { organizationId } });
    return res.map(item => new WhatsappConfig(item));
  }

  async save(config: WhatsappConfig): Promise<WhatsappConfig> {
    const res = await this.repository.save(config as any);
    return new WhatsappConfig(res);
  }

  async updateStatus(id: string, status: WhatsappStatus): Promise<void> {
    await this.repository.update(id, { status });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
