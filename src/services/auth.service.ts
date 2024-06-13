import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import {Profile} from '../interfaces/profile.auth.interface';
import { first } from 'rxjs';
@Injectable()
export class AuthService {
  async validateUser(profile: Profile): Promise<User | null> {
    const { id, username, emails } = profile;
    const user = {
      providerId: id,
      username: username,
      
      email: emails ? emails[0].value : null,
    };
    return user;
  }
}
