import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { Profile } from 'passport';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    profile: Profile,
    accessToken: string,
  ): Promise<User | null> {
    const { id, username, displayName, emails, provider } = profile;

    const email: string = emails[0].value;
    const foundUser = await this.userService.findByEmail(email);

    if (foundUser) {
      // console.log('User Exists!', foundUser);
      foundUser.accessToken = accessToken;
      return await this.userService.update(foundUser.id, { accessToken });
    }
    const user: CreateUserDto = {
      provider: provider,
      providerId: id,
      username: username,
      name: displayName,
      email: emails[0].value,
      accessToken: accessToken,
    };
    const newUser = await this.userService.create(user);
    return newUser;
  }
  async createJwtTokens(
    user: UserEntity,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { id: user.id, email: user.email };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: process.env.JWT_EXPIRATION,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
      }),
    ]);
    return {
      access_token,
      refresh_token,
    };
  }
}