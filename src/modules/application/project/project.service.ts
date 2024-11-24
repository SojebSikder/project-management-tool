import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaClient } from '@prisma/client';
import { ProjectRepository } from 'src/common/repository/project/project.repository';

@Injectable()
export class ProjectService extends PrismaClient {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(user_id: string, createProjectDto: CreateProjectDto) {
    const { name, description } = createProjectDto;

    if (!name) {
      return {
        success: false,
        message: 'Name is required',
      };
    }

    const project = await ProjectRepository.createProject(
      user_id,
      name,
      description,
    );

    if (!project) {
      return {
        success: false,
        message: 'Something went wrong',
      };
    }

    return {
      success: true,
      message: 'Project created successfully',
    };
  }

  async findAll(user_id: string) {
    const projects = await this.prisma.project.findMany({
      where: {
        user_id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        created_at: true,
        updated_at: true,
      },
    });

    return projects;
  }

  async findOne(id: string, user_id: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: id,
        user_id,
      },
    });

    if (project) {
      return {
        success: true,
        data: project,
      };
    } else {
      return {
        success: false,
        message: 'Project not found',
      };
    }
  }

  async update(
    id: string,
    user_id: string,
    updateProjectDto: UpdateProjectDto,
  ) {
    const { name, description } = updateProjectDto;

    // check if project exists
    const projectExists = await this.prisma.project.findFirst({
      where: {
        id: id,
        user_id,
      },
    });

    if (!projectExists) {
      return {
        success: false,
        message: 'Project not found',
      };
    }

    // check if the user is the member of the project
    const isMember = await this.prisma.projectMember.findFirst({
      where: {
        user_id,
        project_id: id,
      },
    });

    if (!isMember) {
      return {
        success: false,
        message: 'You are not a member of this project',
      };
    }

    // update project
    const data = {};
    if (name) {
      data['name'] = name;
    }
    if (description) {
      data['description'] = description;
    }

    await this.prisma.project.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    return {
      success: true,
      message: 'Project updated successfully',
    };
  }

  async remove(id: string, user_id: string) {
    const projectExists = await this.prisma.project.findFirst({
      where: {
        id,
        user_id,
      },
    });

    if (!projectExists) {
      return {
        success: false,
        message: 'Project not found',
      };
    }

    await this.prisma.project.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: 'Project deleted successfully',
    };
  }
}
