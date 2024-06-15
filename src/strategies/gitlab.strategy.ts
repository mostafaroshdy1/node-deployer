import { Injectable } from '@nestjs/common';
import { Strategy as PassportGitLabStrategy } from 'passport-gitlab2';
import { AuthService } from '../services/auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';

@Injectable()
export class GitLabStrategy extends PassportStrategy(PassportGitLabStrategy, 'gitlab') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GITLAB_CLIENT_ID,
      clientSecret: process.env.GITLAB_CLIENT_SECRET,
      callbackURL: process.env.GITLAB_CALLBACK_URL,
      scope: ['read_user'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    // eslint-disable-next-line @typescript-eslint/ban-types
    done: Function,
  ): Promise<any> {
    const user = await this.authService.validateUser(profile, accessToken);

    return done(null, user);
  }
}
