import {
  Controller,
  Get,
  Req,
  Res,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DynamicAuthInterceptor } from '../common/interceptors/dynamic-auth.interceptor';

@Controller('auth')
export class AuthController {
  @Get(':provider')
  @UseInterceptors(DynamicAuthInterceptor)
  async auth(@Req() req: Request) {
    console.log(req.user); // null (if not logged in)
    // Initiates OAuth login
  }

  @Get(':provider/callback')
  @UseInterceptors(DynamicAuthInterceptor)
  async authRedirect(
    @Req() req: Request,
    @Res() res: Response,
    @Param('provider') provider: string,
  ) {
    // Handles OAuth callback
    console.log(provider);

    console.log(req.user); // User data
    res.redirect('/'); // Or handle accordingly
  }
}
