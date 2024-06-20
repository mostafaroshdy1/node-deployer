import { Injectable } from '@nestjs/common';
import { Strategy as PassportGitLabStrategy } from 'passport-gitlab2';
import { AuthService } from '../services/auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';

@Injectable()
export class GitLabStrategy extends PassportStrategy(
  PassportGitLabStrategy,
  'gitlab',
) {
  // private readonly logger = new Logger(GitLabStrategy.name);

  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GITLAB_CLIENT_ID,
      clientSecret: process.env.GITLAB_CLIENT_SECRET,
      callbackURL: process.env.GITLAB_CALLBACK_URL,
      scope: 'api read_api read_user sudo',
      scopeSeparator: ' ',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    // eslint-disable-next-line @typescript-eslint/ban-types
    done: Function,
  ): Promise<any> {
    // this.logger.debug(`Access Token: ${accessToken}`);
    // this.logger.debug(`Profile: ${JSON.stringify(profile)}`);

    const user = await this.authService.validateUser(profile, accessToken);
    // console.log(accessToken);
    return done(null, user);
  }
}
