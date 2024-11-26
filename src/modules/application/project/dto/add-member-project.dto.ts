import { ApiProperty } from '@nestjs/swagger';

export class AddMemberProjectDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  project_id: string;

  @ApiProperty()
  role_id: string;
}
