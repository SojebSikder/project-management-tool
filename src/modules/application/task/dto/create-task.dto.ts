import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  priority?: number;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  project_id: string;
}
