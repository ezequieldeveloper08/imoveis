import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IWhatsappRepository } from '../../domain/repositories/whatsapp.repository';
import { WhatsappConfig, WhatsappStatus } from '../../domain/entities/whatsapp-config.entity';

@Injectable()
export class WhatsappRepository implements IWhatsappRepository {
  constructor(
    @InjectRepository(WhatsappConfig)
    private readonly repository: Repository<WhatsappConfig>,
  ) {}

  async findByBusinessId(businessId: string): Promise<WhatsappConfig | null> {
    return await this.repository.findOne({ where: { businessId } });
  }

  async findByPhoneNumberId(phoneNumberId: string): Promise<WhatsappConfig | null> {
    return await this.repository.findOne({ where: { phoneNumberId } });
  }

  async save(config: WhatsappConfig): Promise<WhatsappConfig> {
    return await this.repository.save(config);
  }

  async updateStatus(id: string, status: WhatsappStatus): Promise<void> {
    await this.repository.update(id, { status });
  }
}
