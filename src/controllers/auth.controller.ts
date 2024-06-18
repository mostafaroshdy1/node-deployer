import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
// import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { DynamicAuthGuard } from 'src/common/interceptors/dynamic-auth.interceptor';
// import { UserEntity } from 'src/entities/user.entity';
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
  async authRedirect(
    @Req() req: Request,
    @Res() res: Response,
    // @Param('provider') provider: string,
  ) {
    // const scopes = ['read_api', 'api']
    // const tokens = await this.authService.createJwtTokens(
    //   plainToInstance(UserEntity, req.user),
    //   'read_api',
    // );
    // const ret = { ...tokens, callbackUrl: process.env.FRONT_END_URL };
    // console.log(ret);
    const token = req.user['accessToken'];
    res
      .status(302)
      .redirect(
        `${process.env.FRONT_END_URL}/auth/callback?access_token=${token}&refresh_token=${token}`,
      );

    // res
    //   .status(302)
    //   .redirect(
    //     `${process.env.FRONT_END_URL}/auth/callback?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`,
    //   );
  }

  @Get(':provider/callback/repo')
  async gitlabAuthCallback(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.headers.authorization.split(' ')[1];
    console.log(accessToken);
    try {
      const repos = await this.authService.getGitLabRepos(accessToken);
      return res.json(repos);
    } catch (error) {
      console.log(error);
    }
  }
}
