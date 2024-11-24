import { Global, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';

@Global()
@Module({
  providers: [MessageGateway, MessageService],
  exports: [MessageGateway],
})
export class MessageModule {}
