import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/services/auth.service';
import { GithubStrategy } from 'src/strategies/github.strategy';
import { UserModule } from './user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/controllers/auth.controller';
import { GitLabStrategy } from 'src/strategies/gitlab.strategy';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { DashboardModule } from './dashboard.module';
import { RepoModule } from './repo.module';

@Module({
  imports: [
    DashboardModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
    forwardRef(() => RepoModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, GithubStrategy, GitLabStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
