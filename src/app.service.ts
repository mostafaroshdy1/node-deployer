import { Injectable } from '@nestjs/common';
import { AuthService } from './services/auth.service';
// @Injectable()
// export class AppService {
//   getHello(): string {
//     return 'Hello World!';
//   }
// }

@Injectable()
export class AppService {
  constructor(private readonly authService: AuthService) {}

  async getHello(): Promise<string> {
    try {
      const response = await this.authService.generateGitAccessToken(
        '667e89b325962aa745027584',
      );
      console.log('Access Token:', response.access_token);
      console.log('Refresh Token:', response.refresh_token);
      return `Access Token: ${response.access_token}, Refresh Token: ${response.refresh_token}`;
    } catch (error) {
      console.error('Error generating Git access token:', error.message);
      return 'Error generating Git access token';
    }
  }
}
