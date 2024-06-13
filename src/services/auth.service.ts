import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
// import { Profile } from '../interfaces/profile.auth.interface';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { Profile } from 'passport';
@Injectable()
export class AuthService {
  constructor(private readonly userService : UserService){}

  async validateUser(profile: Profile): Promise<User | null> {
    const { id, username, displayName, emails , provider} = profile;
    const  user : CreateUserDto = {
      provider : provider,
      providerId: id,
      username: username,
      name: displayName,
      email: emails ? emails[0].value : null,
    };

    const newUser = await this.userService.create(user)
    return newUser;
  }
}
