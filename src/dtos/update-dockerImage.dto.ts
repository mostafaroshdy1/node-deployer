import { PartialType } from '@nestjs/mapped-types';
import { CreateDockerImageDto } from './create-dockerImage.dto';

export class UpdateDockerImageDto extends PartialType(CreateDockerImageDto) {}
