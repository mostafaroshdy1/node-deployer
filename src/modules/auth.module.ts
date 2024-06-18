import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { GithubStrategy } from '../strategies/github.strategy';
import { UserModule } from './user.module';
// import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/controllers/auth.controller';
import { GitLabStrategy } from 'src/strategies/gitlab.strategy';
// import { GitLabRepoStrategy } from 'src/strategies/gitlab-repo.strategy';
// import { RepositoryController } from 'src/controllers/repository.controller';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GithubStrategy, GitLabStrategy],
})
export class AuthModule {}
