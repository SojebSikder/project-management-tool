import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProjectRepository } from '../../../common/repository/project/project.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService extends PrismaClient {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(user_id: string, createTaskDto: CreateTaskDto) {
    try {
      const data = {};
      if (createTaskDto.title) {
        data['title'] = createTaskDto.title;
      }
      if (createTaskDto.description) {
        data['description'] = createTaskDto.description;
      }
      if (createTaskDto.priority) {
        data['priority'] = createTaskDto.priority;
      }
      if (createTaskDto.user_id) {
        data['user_id'] = createTaskDto.user_id;
      }
      if (createTaskDto.project_id) {
        data['project_id'] = createTaskDto.project_id;
      }

      // check if project exists
      const project = await ProjectRepository.checkProjectExists(
        createTaskDto.project_id,
      );

      if (!project) {
        return {
          success: false,
          message: 'Project does not exist',
        };
      }

      // check if the user is a member of the project
      const projectMember = await ProjectRepository.checkProjectMember(
        user_id,
        createTaskDto.project_id,
      );

      if (!projectMember) {
        return {
          success: false,
          message: 'You are not a member of this project',
        };
      }

      // check if user exists
      const user = await this.prisma.user.findUnique({
        where: {
          id: createTaskDto.user_id,
        },
      });

      if (!user) {
        return {
          success: false,
          message: 'User does not exist',
        };
      }

      // create task
      await this.prisma.task.create({
        data: {
          ...data,
        },
      });

      return {
        success: true,
        message: 'Task created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Something went wrong',
      };
    }
  }

  findAll(user_id: string) {}

  async findOne(id: string, user_id: string) {
    try {
      const task = await this.prisma.task.findUnique({
        where: {
          id: id,
        },
      });

      if (!task) {
        return {
          success: false,
          message: 'Task does not exist',
        };
      }

      return {
        success: true,
        data: task,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Something went wrong',
      };
    }
  }

  async update(id: string, user_id, updateTaskDto: UpdateTaskDto) {
    try {
      const task = await this.prisma.task.findUnique({
        where: {
          id: id,
        },
      });

      if (!task) {
        return {
          success: false,
          message: 'Task does not exist',
        };
      }

      await this.prisma.task.update({
        where: {
          id: id,
        },
        data: {
          ...updateTaskDto,
        },
      });

      return {
        success: true,
        message: 'Task updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Something went wrong',
      };
    }
  }

  async remove(id: string, user_id: string) {
    try {
      const task = await this.prisma.task.findUnique({
        where: {
          id: id,
        },
      });

      if (!task) {
        return {
          success: false,
          message: 'Task does not exist',
        };
      }

      await this.prisma.task.delete({
        where: {
          id: id,
        },
      });

      return {
        success: true,
        message: 'Task deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Something went wrong',
      };
    }
  }
}
