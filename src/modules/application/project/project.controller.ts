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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AbilitiesGuard } from '../../../ability/abilities.guard';
import { CheckAbilities } from '../../../ability/abilities.decorator';
import { Action } from '../../../ability/ability.factory';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiBearerAuth()
@ApiTags('Project')
@UseGuards(JwtAuthGuard, AbilitiesGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({ summary: 'Create project' })
  @CheckAbilities({ action: Action.Create, subject: 'Project' })
  @Post()
  async create(
    @Req() req: Request,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    try {
      const user_id = req.user.userId;
      const project = await this.projectService.create(
        user_id,
        createProjectDto,
      );

      return project;
    } catch (error) {
      return {
        success: false,
        message: 'Something went wrong',
      };
    }
  }

  @ApiOperation({ summary: 'Read all projects' })
  @CheckAbilities({ action: Action.Read, subject: 'Project' })
  @Get()
  async findAll(@Req() req: Request) {
    try {
      const user_id = req.user.userId;
      const project = await this.projectService.findAll(user_id);

      return {
        success: true,
        data: project,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Something went wrong',
      };
    }
  }

  @ApiOperation({ summary: 'Show project' })
  @CheckAbilities({ action: Action.Show, subject: 'Project' })
  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    try {
      const user_id = req.user.userId;
      const project = await this.projectService.findOne(id, user_id);

      return project;
    } catch (error) {
      return {
        success: false,
        message: 'Something went wrong',
      };
    }
  }

  @ApiOperation({ summary: 'Update project' })
  @CheckAbilities({ action: Action.Update, subject: 'Project' })
  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    try {
      const user_id = req.user.userId;
      const project = await this.projectService.update(
        id,
        user_id,
        updateProjectDto,
      );

      return project;
    } catch (error) {
      return {
        success: false,
        message: 'Something went wrong',
      };
    }
  }

  @ApiOperation({ summary: 'Delete project' })
  @CheckAbilities({ action: Action.Delete, subject: 'Project' })
  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    try {
      const user_id = req.user.userId;
      const project = await this.projectService.remove(id, user_id);

      return project;
    } catch (error) {
      return {
        success: false,
        message: 'Something went wrong',
      };
    }
  }
}
