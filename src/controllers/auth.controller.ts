import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { DynamicAuthGuard } from 'src/common/guards/dynamic-auth.guard';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(':provider')
  @UseGuards(DynamicAuthGuard)
  async auth(@Req() req: Request) {
    console.log(req.user);
  }

  @Get(':provider/callback')
  @UseGuards(DynamicAuthGuard)
  async authRedirect(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.user['accessToken'];
    res
      .status(302)
      .redirect(
        `${process.env.FRONT_END_URL}auth/callback?access_token=${accessToken}&refresh_token=${accessToken}`
      );
  }


  @Get(':provider/callback/repo')
  async gitlabAuthCallback(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.headers.authorization.split(' ')[1];
    console.log(`Access Token: ${accessToken}`);
    const provider = req.params.provider;  
    console.log(`Provider: ${provider}`);

    try {
      const user = await this.authService.getGitLabUser(accessToken);
      const repos = await this.authService.getGitLabRepos(accessToken);
      const response = {
        provider: provider,
        user: user,
        repos: repos
      };
      return res.json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
