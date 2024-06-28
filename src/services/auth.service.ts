import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { Profile } from 'passport';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import providers from 'src/common/types/providers';
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
    refreshToken: string,
  ): Promise<User | null> {
    const { id, username, displayName, emails, provider } = profile;
    const email: string = emails[0].value;

    let user = await this.userService.findByEmailAndProvider(email, provider);

    if (user) {
      user = await this.userService.update(user.id, {
        accessToken,
        refreshToken,
      });
    } else {
      const newUser: CreateUserDto = {
        provider: provider,
        providerId: id,
        username: username,
        name: displayName,
        email: emails[0].value,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      user = await this.userService.create(newUser);
    }

    return user;
  }

  async createJwtTokens(user: UserEntity): Promise<{ access_token: string }> {
    const payload = {
      id: user.id,
      email: user.email,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    };
    const [access_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: process.env.JWT_EXPIRATION,
      }),
    ]);
    return { access_token };
  }

  async generateGitAccessToken(
    userId: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userService.findById(userId);
    console.log('User:', user);
    if (!user) {
      throw new NotFoundException(`User not found for id: ${userId}`);
    }

    const { provider, refreshToken } = user;
    const { client_id, client_secret } = providers[provider].options;

    let url: string;
    let params: URLSearchParams | Record<string, string>;
    if (provider === 'github') {
      url = `https://${provider}.com/login/oauth/access_token`;
      params = new URLSearchParams();
      params.append('grant_type', 'refresh_token');
      params.append('refresh_token', refreshToken);
      params.append('client_id', client_id);
      params.append('client_secret', client_secret);
    } else if (provider === 'gitlab') {
      url = `https://${provider}.com/oauth/token`;
      params = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: client_id,
        client_secret: client_secret,
      };
    } else {
      throw new InternalServerErrorException(
        `Unsupported provider: ${provider}`,
      );
    }

    try {
      const response = await axios.post(url, params, {
        headers: {
          'Content-Type':
            provider === 'github'
              ? 'application/x-www-form-urlencoded'
              : 'application/json',
          Accept: 'application/json',
        },
      });

      if (response.status !== 200) {
        throw new InternalServerErrorException(
          `Failed to refresh access token for provider: ${provider}`,
        );
      }

      const { access_token, refresh_token } = response.data;
      await this.userService.update(userId, {
        accessToken: access_token,
        refreshToken: refresh_token,
      });

      return { access_token, refresh_token };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to refresh access token for provider: ${provider} - ${error.message}`,
      );
    }
  }

  async getRedirectUrl(provider: string) {
    if (!providers[provider]) {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    const { rootUrl, options } = providers[provider];
    const queryString = new URLSearchParams(options).toString();
    return `${rootUrl}?${queryString}`;
  }
}
