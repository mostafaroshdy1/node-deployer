import { Module } from '@nestjs/common';
import { RepoController } from 'src/controllers/repo.controller';
import { RepoService } from 'src/services/repo.service';

@Module({
  imports: [],
  controllers: [RepoController],
  providers: [RepoService],
})
export class RepoModule {}
