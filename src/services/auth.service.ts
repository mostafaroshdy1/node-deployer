import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { Profile } from 'passport';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/entities/user.entity';
import axios from 'axios';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}

	async validateUser(profile: Profile, accessToken: string): Promise<User | null> {
		const { id, username, displayName, emails, provider } = profile;
		const email: string = emails[0].value;
		const foundUser = await this.userService.findByEmailAndProvider(email, provider);

		if (foundUser) {
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
		return this.userService.create(user);
	}

	async createJwtTokens(
		user: UserEntity,
		scope: string,
	): Promise<{ access_token: string; refresh_token: string }> {
		const payload = {
			id: user.id,
			email: user.email,
			scope: scope,
		};
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
		let rootUrl: string;
		let options;
		switch (provider) {
			case 'github':
				rootUrl = 'https://github.com/login/oauth/authorize';
				options = {
					client_id: process.env.GITHUB_CLIENT_ID,
					redirect_uri: process.env.GITHUB_CALLBACK_URL,
					scope: 'scope',
				};
				break;
			case 'gitlab':
				rootUrl = 'https://gitlab.com/oauth/authorize';
				options = {
					client_id: process.env.GITLAB_CLIENT_ID,
					redirect_uri: process.env.GITLAB_CALLBACK_URL,
					scope: 'api read_api read_user sudo',
					response_type: 'code',
				};
				break;
		}

		const queryString = new URLSearchParams(options).toString();

		const url = `${rootUrl}?${queryString.toString()}`;

		return url;
	}
}
