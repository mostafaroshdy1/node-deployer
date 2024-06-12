import { Injectable } from '@nestjs/common';
import { Strategy as GitHubStrategy } from 'passport-github';
import { AuthService } from '../services/auth.service';
import { createStrategy } from './base.strategy';

const GithubStrategyBase = createStrategy(GitHubStrategy, 'github');

@Injectable()
export class GithubStrategy extends GithubStrategyBase {
  constructor(authService: AuthService) {
    super(authService, {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    });
  }
}
