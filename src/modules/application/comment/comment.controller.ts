import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiBearerAuth()
@ApiTags('Post')
@UseGuards(JwtAuthGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: 'Create comment' })
  @Post()
  async create(
    @Req() req: Request,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const user = req.user;

    if (!createCommentDto.body) {
      return {
        success: false,
        message: 'Comment body is required',
      };
    }

    const comment = await this.commentService.create(
      user.userId,
      createCommentDto,
    );

    if (comment) {
      return {
        success: true,
        message: 'Comment created successfully',
      };
    } else {
      return {
        success: false,
        message: 'Comment not created',
      };
    }
  }

  @ApiOperation({ summary: 'Find all comments' })
  @Get(':post_id/all')
  async findAll(@Param('post_id') post_id: string) {
    const comment = await this.commentService.findAll(post_id);

    return {
      success: true,
      data: comment,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @ApiOperation({ summary: 'Delete comment' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user;
    const comment = await this.commentService.remove(id, user.userId);

    return comment;
  }
}
