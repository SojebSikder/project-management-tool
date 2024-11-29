import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ProjectRepository } from '../../../common/repository/project/project.repository';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddMemberProjectDto } from './dto/add-member-project.dto';
import { UserRepository } from 'src/common/repository/user/user.repository';

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
        tasks: true,
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
      include: {
        tasks: true,
        project_members: {
          select: {
            user_id: true,
            role_id: true,
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
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

  async addMember(user_id: string, addMemberProjectDto: AddMemberProjectDto) {
    // check if the project exists
    const projectExists = await this.prisma.project.findFirst({
      where: {
        id: addMemberProjectDto.project_id,
        user_id: user_id,
      },
    });

    if (!projectExists) {
      return {
        success: false,
        message: 'Project not found',
      };
    }

    // check if the user is the member of the project
    const memberExists = await this.prisma.projectMember.findFirst({
      where: {
        user_id: user_id,
        project_id: addMemberProjectDto.project_id,
      },
    });

    if (!memberExists) {
      return {
        success: false,
        message: 'You are not allowed to add member to this project',
      };
    }

    const userDetails = await UserRepository.getUserByEmail(
      addMemberProjectDto.email,
    );

    if (!userDetails) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    // check if the member  is the member of the project
    const isMember = await this.prisma.projectMember.findFirst({
      where: {
        user_id: userDetails.id,
        project_id: addMemberProjectDto.project_id,
      },
    });

    if (isMember) {
      return {
        success: false,
        message: 'Member already exists',
      };
    }

    // add member to project
    await this.prisma.projectMember.create({
      data: {
        user_id: userDetails.id,
        project_id: addMemberProjectDto.project_id,
        role_id: addMemberProjectDto.role_id,
      },
    });

    return {
      success: true,
      message: 'Member added successfully',
    };
  }

  async removeMember(
    user_id: string,
    addMemberProjectDto: AddMemberProjectDto,
  ) {
    // check if the project exists
    const projectExists = await this.prisma.project.findFirst({
      where: {
        id: addMemberProjectDto.project_id,
        user_id: user_id,
      },
    });

    if (!projectExists) {
      return {
        success: false,
        message: 'Project not found',
      };
    }

    // check if the user is the member of the project
    const memberExists = await this.prisma.projectMember.findFirst({
      where: {
        user_id: user_id,
        project_id: addMemberProjectDto.project_id,
      },
    });

    if (!memberExists) {
      return {
        success: false,
        message: 'You are not allowed to remove member from this project',
      };
    }

    const userDetails = await UserRepository.getUserByEmail(
      addMemberProjectDto.email,
    );

    if (!userDetails) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    // check if the member is the member of the project
    const isMember = await this.prisma.projectMember.findFirst({
      where: {
        user_id: userDetails.id,
        project_id: addMemberProjectDto.project_id,
      },
    });

    if (!isMember) {
      return {
        success: false,
        message: 'Member not found',
      };
    }

    // remove member from project
    await this.prisma.projectMember.deleteMany({
      where: {
        user_id: userDetails.id,
        project_id: addMemberProjectDto.project_id,
      },
    });

    return {
      success: true,
      message: 'Member removed successfully',
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
