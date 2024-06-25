import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { Profile } from 'passport';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { UserEntity } from 'src/entities/user.entity';
import providers from 'src/common/types/providers';

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


	async getGitLabRepos(accessToken: string) {
		try {
			const response = await axios.get('https://gitlab.com/api/v4/projects', {
				params: { owned: true },
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			return response.data;
		} catch (error) {
			console.error('Error fetching GitLab repositories:', error.response.data);
			throw new InternalServerErrorException(
				'Failed to fetch GitLab repositories: ' + error.response.data.error_description,
			);
		}
	}

	async getGitLabUser(accessToken: string) {
		try {
			const response = await axios.get('https://gitlab.com/api/v4/user', {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			return response.data;
		} catch (error) {
			console.error('Error fetching GitLab user:', error.response.data);
			throw new InternalServerErrorException(
				'Failed to fetch GitLab user: ' + error.response.data.error_description,
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


  async getGitLabUser(accessToken: string) {
    try {
      const response = await axios.get('https://gitlab.com/api/v4/user', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching GitLab user:', error.response.data);
      throw new InternalServerErrorException(
        'Failed to fetch GitLab user: ' + error.response.data.error_description,
      );
    }
  }

  // async refreshAccessToken(
  //   refreshToken: string,
  // ): Promise<{ accessToken: string; refreshToken: string }> {
  //   try {

  //     const response = await axios.post('https://gitlab.com/oauth/token', {
  //       grant_type: 'refresh_token',
  //       refresh_token: refreshToken,
  //       client_id: process.env.GITLAB_CLIENT_ID,
  //       client_secret: process.env.GITLAB_CLIENT_SECRET,
  //     });

  //     const newAccessToken = response.data.access_token;
  //     const newRefreshToken = response.data.refresh_token;

  //     return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  //   } catch (error) {
  //     console.error(
  //       'Error refreshing access token:',
  //       error.response?.data || error.message,
  //     );
  //     throw new InternalServerErrorException('Failed to refresh access token');
  //   }
  // }

}
