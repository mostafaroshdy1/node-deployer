import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { DynamicAuthGuard } from 'src/common/guards/dynamic-auth.guard';
import { AuthService } from 'src/services/auth.service';
import { UserEntity } from 'src/entities/user.entity';

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
    const tokens = await this.authService.createJwtTokens(
      req.user as UserEntity,
    );
    res
      .status(302)
      .redirect(
        `${process.env.FRONT_END_URL}/auth/callback?accessToken=${tokens.access_token}&provider=${req.params.provider}`,
      );
  }

  @Get('redirectUrl/:provider')
  async redirectUrl(@Req() req: Request, @Res() res: Response) {
    const url = await this.authService.getRedirectUrl(req.params.provider);
    return res.json({ url });
  }
}
