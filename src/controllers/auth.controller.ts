import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get(':provider')
  @UseGuards(AuthGuard('jwt'))  
  async auth(@Req() req, @Param('provider') provider: string) {}

  @Get(':provider/callback')
  @UseGuards(AuthGuard('jwt'))  
  authRedirect(@Req() req, @Param('provider') provider: string) {
    return req.user;
  }
}
