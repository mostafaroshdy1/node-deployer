import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { AuthService } from '../services/auth.service';

export function createStrategy(Strategy: any, strategyName: string) {
  return class extends PassportStrategy(Strategy, strategyName) {
    constructor(public readonly authService: AuthService, options: any) {
      super(options);
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: Function) {
      const user = await this.authService.validateUser(profile);
      done(null, user);
    }
  };
}


