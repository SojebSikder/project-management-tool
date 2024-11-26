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
import { TaskService } from './task.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AbilitiesGuard } from '../../../ability/abilities.guard';
import { CheckAbilities } from '../../../ability/abilities.decorator';
import { Action } from '../../../ability/ability.factory';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiBearerAuth()
@ApiTags('Task')
@UseGuards(JwtAuthGuard, AbilitiesGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Create task' })
  @CheckAbilities({ action: Action.Create, subject: 'Task' })
  @Post()
  async create(@Req() req: Request, @Body() createTaskDto: CreateTaskDto) {
    try {
      const user_id = req.user.userId;
      const task = await this.taskService.create(user_id, createTaskDto);

      return task;
    } catch (error) {
      return {
        success: false,
        message: 'Something went wrong',
      };
    }
  }

  @ApiOperation({ summary: 'Read task' })
  @CheckAbilities({ action: Action.Read, subject: 'Task' })
  @Get()
  async findAll(@Req() req: Request) {
    try {
      const user_id = req.user.userId;
      const task = await this.taskService.findAll(user_id);

      return task;
    } catch (error) {
      return {
        success: false,
        message: 'Something went wrong',
      };
    }
  }

  @ApiOperation({ summary: 'Show task' })
  @CheckAbilities({ action: Action.Show, subject: 'Task' })
  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    try {
      const user_id = req.user.userId;
      const task = await this.taskService.findOne(id, user_id);

      return task;
    } catch (error) {
      return {
        success: false,
        message: 'Something went wrong',
      };
    }
  }

  @ApiOperation({ summary: 'Update task' })
  @CheckAbilities({ action: Action.Update, subject: 'Task' })
  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    try {
      const user_id = req.user.userId;
      const task = await this.taskService.update(id, user_id, updateTaskDto);

      return task;
    } catch (error) {
      return {
        success: false,
        message: 'Something went wrong',
      };
    }
  }

  @ApiOperation({ summary: 'Delete task' })
  @CheckAbilities({ action: Action.Delete, subject: 'Task' })
  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    try {
      const user_id = req.user.userId;
      const task = await this.taskService.remove(id, user_id);

      return task;
    } catch (error) {
      return {
        success: false,
        message: 'Something went wrong',
      };
    }
  }
}
