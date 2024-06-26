import { PartialType } from '@nestjs/mapped-types';
import { CreateRepoDto } from './create-repo.dto';

export class UpdateRepoDto extends PartialType(CreateRepoDto) {}
