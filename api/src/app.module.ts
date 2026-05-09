import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationModule } from './modules/organizations/organizations.module';
import { LeadModule } from './modules/leads/leads.module';
import { PropertyModule } from './modules/properties/properties.module';
import { EventModule } from './modules/events/events.module';
import { ConversationModule } from './modules/conversations/conversations.module';
import { ProposalsModule } from './modules/proposals/proposals.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { ContactModule } from './modules/contacts/contact.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    SharedModule,
    AuthModule,
    OrganizationModule,
    LeadModule,
    PropertyModule,
    EventModule,
    ConversationModule,
    ProposalsModule,
    AppointmentsModule,
    ContactModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
