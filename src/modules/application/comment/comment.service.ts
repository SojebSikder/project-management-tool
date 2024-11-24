import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CommentService extends PrismaClient {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(user_id: string, createCommentDto: CreateCommentDto) {
    const comment = await this.comment.create({
      data: {
        body: createCommentDto.body,
        user_id: user_id,
        post_id: createCommentDto.post_id,
      },
    });

    return comment;
  }

  async findAll(post_id: string) {
    const comments = await this.comment.findMany({
      where: {
        post_id: post_id,
      },
      select: {
        id: true,
        body: true,
        created_at: true,
        updated_at: true,
      },
    });
    return comments;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  async remove(id: string, user_id: string) {
    const comment = await this.comment.findUnique({
      where: {
        id: id,
      },
    });

    if (!comment) {
      return {
        success: false,
        message: 'Comment not found',
      };
    }

    if (comment.user_id != user_id) {
      return {
        success: false,
        message: 'You are not authorized to delete this comment',
      };
    }

    await this.comment.delete({
      where: {
        id: id,
      },
    });

    return {
      success: true,
      message: 'Comment deleted successfully',
    };
  }
}
