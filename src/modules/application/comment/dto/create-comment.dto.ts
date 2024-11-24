import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  body: string;

  @ApiProperty()
  post_id: string;
}
