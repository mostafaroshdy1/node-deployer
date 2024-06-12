import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { GithubStrategy } from '../strategies/github.strategy'


@Module({
  imports: [PassportModule.register({ defaultStrategy: 'github' })],
  providers: [AuthService, GithubStrategy],
})
export class AuthModule {}
