import { PartialType } from '@nestjs/swagger';
import { AddMemberProjectDto } from './add-member-project.dto';

export class UpdateMemberProjectDto extends PartialType(AddMemberProjectDto) {}
