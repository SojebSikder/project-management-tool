import { Module } from '@nestjs/common';
import { CommentModule } from './comment/comment.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [CommentModule, ProjectModule],
})
export class ApplicationModule {}
