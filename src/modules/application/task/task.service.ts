import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProjectRepository } from '../../../common/repository/project/project.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { NotificationGateway } from '../notification/notification.gateway';
import { NotificationRepository } from '../../../common/repository/notification/project.repository';

@Injectable()
export class TaskService extends PrismaClient {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationGateway: NotificationGateway,
  ) {
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
      if (createTaskDto.assigned_to) {
        data['assigned_to'] = createTaskDto.assigned_to;
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
          id: createTaskDto.assigned_to,
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

      if (createTaskDto.assigned_to && createTaskDto.assigned_to != user_id) {
        // Create notification
        const notificationMessage = `You have been assigned a task: ${createTaskDto.title}`;

        await NotificationRepository.createNotification({
          sender_id: user_id,
          receiver_id: createTaskDto.assigned_to,
          text: notificationMessage,
          type: 'task',
        });

        // Emit notification to assigned member
        this.notificationGateway.server
          .to(createTaskDto.assigned_to)
          .emit('receiveNotification', {
            message: notificationMessage,
          });
        // end create notification
      }

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

      if (updateTaskDto.assigned_to && updateTaskDto.assigned_to != user_id) {
        // Create notification for assigned member
        const notificationMessage = `You have been assigned a task: ${updateTaskDto.title}`;

        await NotificationRepository.createNotification({
          sender_id: user_id,
          receiver_id: updateTaskDto.assigned_to,
          text: notificationMessage,
          type: 'task',
        });

        // Emit notification to assigned member
        this.notificationGateway.server
          .to(updateTaskDto.assigned_to)
          .emit('receiveNotification', {
            message: notificationMessage,
          });
        // end create notification

        // Create notification for previous assigned member
        const notificationMessage2 = `You have been unassigned from a task: ${updateTaskDto.title}`;

        await NotificationRepository.createNotification({
          sender_id: user_id,
          receiver_id: task.assigned_to,
          text: notificationMessage2,
          type: 'task',
        });

        // Emit notification to assigned member
        this.notificationGateway.server
          .to(task.assigned_to)
          .emit('receiveNotification', {
            message: notificationMessage2,
          });
        // end create notification
      }

      // send notification for task status change
      if (
        updateTaskDto.status &&
        updateTaskDto.status != task.status &&
        updateTaskDto.assigned_to == user_id
      ) {
        const projectMember = await this.prisma.projectMember.findMany({
          where: {
            user_id: user_id,
          },
        });

        projectMember.map(async (member) => {
          if (member.user_id != user_id) {
            const notificationMessage = `Task status changed to: ${updateTaskDto.status}`;

            await NotificationRepository.createNotification({
              sender_id: user_id,
              receiver_id: member.user_id,
              text: notificationMessage,
              type: 'task',
            });

            // Emit notification to assigned member
            this.notificationGateway.server
              .to(member.user_id)
              .emit('receiveNotification', {
                message: notificationMessage,
              });
            // end create notification
          }
        });
      }

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

  // add dependency
  async addDependency(id: string, dependency_id: string, user_id: string) {
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

      const dependency = await this.prisma.task.findUnique({
        where: {
          id: dependency_id,
        },
      });

      if (!dependency) {
        return {
          success: false,
          message: 'Dependency does not exist',
        };
      }

      await this.prisma.taskDependency.create({
        data: {
          task_id: id,
          parent_task_id: dependency_id,
        },
      });

      return {
        success: true,
        message: 'Dependency added successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Something went wrong',
      };
    }
  }

  // remove dependency
  async removeDependency(id: string, dependency_id: string, user_id: string) {
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

      const dependency = await this.prisma.task.findUnique({
        where: {
          id: dependency_id,
        },
      });

      if (!dependency) {
        return {
          success: false,
          message: 'Dependency does not exist',
        };
      }

      await this.prisma.taskDependency.deleteMany({
        where: {
          task_id: id,
          parent_task_id: dependency_id,
        },
      });

      return {
        success: true,
        message: 'Dependency removed successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Something went wrong',
      };
    }
  }

  // get dependencies
  async getDependencies(id: string, user_id: string) {
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

      const dependencies = await this.prisma.taskDependency.findMany({
        where: {
          task_id: id,
        },
      });

      return {
        success: true,
        data: dependencies,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Something went wrong',
      };
    }
  }

  // get dependants
  async getDependants(id: string, user_id: string) {
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

      const dependants = await this.prisma.taskDependency.findMany({
        where: {
          parent_task_id: id,
        },
      });

      return {
        success: true,
        data: dependants,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Something went wrong',
      };
    }
  }
}
