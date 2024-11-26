import { Module } from '@nestjs/common';
import { CommentModule } from './comment/comment.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [CommentModule, ProjectModule, TaskModule],
})
export class ApplicationModule {}
