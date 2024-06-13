import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { GithubStrategy } from '../strategies/github.strategy'
import { UserService } from 'src/services/user.service';
import { UserRepository } from 'src/repositories/user.repository';
import { UserModule } from './user.module';


@Module({
  imports: [UserModule,PassportModule.register({ defaultStrategy: 'github' })],
  providers: [AuthService,UserService, GithubStrategy,UserRepository],
})
export class AuthModule {}
