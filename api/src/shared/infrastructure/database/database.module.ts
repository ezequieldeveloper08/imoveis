import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserSchema } from '../../../modules/auth/infrastructure/repositories/user.schema';
import { OrganizationSchema } from '../../../modules/organizations/infrastructure/repositories/organization.schema';
import { LeadSchema } from '../../../modules/leads/infrastructure/repositories/lead.schema';
import { PropertySchema } from '../../../modules/properties/infrastructure/repositories/property.schema';
import { ConversationSchema, MessageSchema } from '../../../modules/conversations/infrastructure/repositories/conversation.schema';
import { EventSchema } from '../../../modules/events/infrastructure/repositories/event.schema';

import { ProposalSchema } from '../../../modules/proposals/infrastructure/repositories/proposal.schema';
import { AppointmentSchema } from '../../../modules/appointments/infrastructure/repositories/appointment.schema';
import { ContactSchema } from '../../../modules/contacts/infrastructure/repositories/contact.schema';
import { WhatsappConfigSchema, WhatsappMessageSchema } from '../../../modules/whatsapp/infrastructure/repositories/whatsapp.schema';
import { DepartmentSchema } from '../../../modules/departments/infrastructure/repositories/department.schema';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.get('DATABASE_URL'),
        entities: [
          UserSchema,
          OrganizationSchema,
          LeadSchema,
          PropertySchema,
          ConversationSchema,
          MessageSchema,
          EventSchema,
          ProposalSchema,
          AppointmentSchema,
          ContactSchema,
          WhatsappConfigSchema,
          WhatsappMessageSchema,
          DepartmentSchema,
        ],
        synchronize: true, // Only for development
      }),
    }),
  ],
})
export class DatabaseModule {}
