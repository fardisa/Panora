import { Module } from '@nestjs/common';
import { CrmConnectionsService } from './services/crm-connection.service';
import { PrismaService } from '@@core/prisma/prisma.service';
import { FreshsalesConnectionService } from './services/freshsales/freshsales.service';
import { HubspotConnectionService } from './services/hubspot/hubspot.service';
import { PipedriveConnectionService } from './services/pipedrive/pipedrive.service';
import { ZendeskConnectionService } from './services/zendesk/zendesk.service';
import { ZohoConnectionService } from './services/zoho/zoho.service';
import { LoggerService } from '@@core/logger/logger.service';
import { WebhookService } from '@@core/webhook/webhook.service';
import { WebhookModule } from '@@core/webhook/webhook.module';
import { EnvironmentService } from '@@core/environment/environment.service';
import { EncryptionService } from '@@core/encryption/encryption.service';

@Module({
  imports: [WebhookModule],
  providers: [
    CrmConnectionsService,
    PrismaService,
    FreshsalesConnectionService,
    HubspotConnectionService,
    PipedriveConnectionService,
    ZendeskConnectionService,
    ZohoConnectionService,
    LoggerService,
    WebhookService,
    EnvironmentService,
    EncryptionService,
  ],
  exports: [CrmConnectionsService],
})
export class CrmConnectionModule {}
