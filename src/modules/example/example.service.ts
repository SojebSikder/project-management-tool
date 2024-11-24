import { Injectable } from '@nestjs/common';
import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';

import { PrismaClient } from '@prisma/client';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Sojebvar } from '../../common/lib/Sojebvar/Sojebvar';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRepository } from 'src/common/repository/user/user.repository';

@Injectable()
export class ExampleService extends PrismaClient {
  constructor(
    @InjectQueue('message-queue') private queue: Queue,
    private prisma: PrismaService,
  ) {
    super();
  }

  create(createExampleDto: CreateExampleDto) {
    return 'This action adds a new example';
  }

  async findAll() {
    // add queue example
    const job = await this.queue.add('sendMessage', {
      message: 'hello sojeb',
    });

    // end testing
    const text = 'my name is ${name} and I am ${age} years old';
    Sojebvar.addVariable({
      name: 'sojeb',
      age: 20,
    });
    const data = Sojebvar.parse(text);
    return { test: data };
  }

  async test(user_id: string) {
    const user = await UserRepository.getUserDetails(user_id);
    return user;
  }

  findOne(id: number) {
    return `This action returns a #${id} example`;
  }

  update(id: number, updateExampleDto: UpdateExampleDto) {
    return `This action updates a #${id} example`;
  }

  remove(id: number) {
    return `This action removes a #${id} example`;
  }
}
