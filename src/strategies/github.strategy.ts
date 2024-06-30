import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy as GitHubStrategy } from 'passport-github';
import { AuthService } from '../services/auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';

@Injectable()
export class GithubStrategy extends PassportStrategy(GitHubStrategy, 'github') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user', 'repo'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    // eslint-disable-next-line @typescript-eslint/ban-types
    done: Function,
  ): Promise<any> {
    if (!accessToken || !refreshToken) {
      return done(new UnauthorizedException('Invalid tokens'), null);
    }

    const user = await this.authService.validateUser(
      profile,
      accessToken,
      refreshToken,
    );

    return done(null, user);
  }
}
