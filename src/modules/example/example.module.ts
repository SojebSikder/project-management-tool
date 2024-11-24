import { Module } from '@nestjs/common';
import { ExampleService } from './example.service';
import { ExampleController } from './example.controller';
import { BullModule } from '@nestjs/bullmq';
import { ExampleProcessor } from './processors/example.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'message-queue',
    }),
  ],
  controllers: [ExampleController],
  providers: [ExampleService, ExampleProcessor],
})
export class ExampleModule {}
