import { Injectable, Logger } from '@nestjs/common';
import { Strategy as PassportGitLabStrategy } from 'passport-gitlab2';
import { PassportStrategy } from '@nestjs/passport';
import axios from 'axios';
import { Profile } from 'passport';

@Injectable()
export class GitLabRepoStrategy extends PassportStrategy(PassportGitLabStrategy, 'gitlab-repo') {
  private readonly logger = new Logger(GitLabRepoStrategy.name);

  constructor() {
    super({
      clientID: process.env.GITLAB_CLIENT_ID,
      clientSecret: process.env.GITLAB_CLIENT_SECRET,
      callbackURL: process.env.GITLAB_CALLBACK_URL + '/repo', 
      scope: ['api'], 
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function,
  ): Promise<any> {
    this.logger.debug(`Access Token: ${accessToken}`);
    this.logger.debug(`Profile: ${JSON.stringify(profile)}`);

    try {
      
      const response = await axios.get('https://gitlab.com/api/v4/projects', {
        params: {
          owned: true,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const repositories = response.data;

      this.logger.debug(`Fetched Repositories: ${JSON.stringify(repositories)}`);

      return done(null, repositories);
    } catch (error) {
      return done(error, null);
    }
  }
}
