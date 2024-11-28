import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  priority?: number;

  @ApiProperty()
  assigned_to: string;

  @ApiProperty()
  project_id: string;
}
