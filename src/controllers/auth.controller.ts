import { Controller, Get, Req, Res, UseGuards, Param } from '@nestjs/common';
import { Request, Response } from 'express';
import { DynamicAuthGuard } from '../guards/dynamic-auth.guard';

@Controller('auth')
export class AuthController {
  @Get(':provider')
  @UseGuards(DynamicAuthGuard)
  async auth(@Req() req: Request) {
    console.log(req.user); // null (if not logged in)
    // Initiates OAuth login
  }

  @Get(':provider/callback')
  @UseGuards(DynamicAuthGuard)
  async authRedirect(
    @Req() req: Request,
    @Res() res: Response,
    @Param('provider') provider: string,
  ) {
    // Handles OAuth callback
    console.log(provider);
    const user = req.user;
    console.log(user); // User data
    // Redirect or respond with user data
    res.redirect('/'); // Or handle accordingly
  }
}
