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

    let newUser = await this.userService.findByEmail(user.email);

    if(newUser)
      console.log("User Exists!", newUser);
    else{
      newUser = await this.userService.create(user);
      console.log("User Created!", newUser);
    }
    return newUser;
  }
}
