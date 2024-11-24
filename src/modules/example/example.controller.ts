import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ExampleService } from './example.service';
import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AbilitiesGuard } from '../../ability/abilities.guard';
import { HasPlanGuard } from 'src/common/guard/has-plan/has-plan.guard';
import { CheckAbilities } from 'src/ability/abilities.decorator';
import { Action } from '../../ability/ability.factory';

@ApiBearerAuth()
@ApiTags('Example')
@UseGuards(JwtAuthGuard, AbilitiesGuard, HasPlanGuard)
@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @ApiOperation({ summary: 'Send message' })
  @CheckAbilities({ action: Action.Create, subject: 'Example' })
  @Post()
  create(@Body() createExampleDto: CreateExampleDto) {
    return this.exampleService.create(createExampleDto);
  }

  @Get()
  async findAll() {
    return await this.exampleService.findAll();
  }

  @ApiOperation({ summary: 'Test' })
  @CheckAbilities({ action: Action.Create, subject: 'Group' })
  @Get('test')
  async test(@Req() req: Request) {
    const user = req.user;
    const data = await this.exampleService.test(user.userId);
    return data;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exampleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExampleDto: UpdateExampleDto) {
    return this.exampleService.update(+id, updateExampleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exampleService.remove(+id);
  }
}
