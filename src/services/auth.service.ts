import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Profile } from '../interfaces/profile.auth.interface';
@Injectable()
export class AuthService {
  async validateUser(profile: Profile): Promise<User | null> {
    const { id, username, displayName, emails } = profile;
    const user = {
      providerId: id,
      username: username,
      displayName: displayName,

      email: emails ? emails[0].value : null,
    };
    return user;
  }
}
