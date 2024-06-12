import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async validateUser(profile: any): Promise<any> {
    const { id, username, emails } = profile;
    const user = {
      providerId: id,
      username: username,
      email: emails ? emails[0].value : null,
    };
    return user;
  }
}
