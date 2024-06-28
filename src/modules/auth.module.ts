import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { GithubStrategy } from '../strategies/github.strategy';
import { UserModule } from './user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/controllers/auth.controller';
import { GitLabStrategy } from 'src/strategies/gitlab.strategy';
import { JwtStrategy } from 'src/strategies/jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || "ay 7agaa",
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GithubStrategy, GitLabStrategy, JwtStrategy],
})
export class AuthModule {}
