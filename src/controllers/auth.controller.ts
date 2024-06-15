import { Controller, Get, Req, Res, Param, UseGuards, Redirect } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { DynamicAuthGuard } from 'src/common/interceptors/dynamic-auth.interceptor';
import { UserEntity } from 'src/entities/user.entity';
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
		@Param('provider') provider: string,
	) {
		const tokens = await this.authService.createJwtTokens(plainToInstance(UserEntity, req.user));
		const ret = { ...tokens, callbackUrl: process.env.FE_CALLBACK_URL };
		console.log(ret);

		res
			.status(302)
			.redirect(
				`${process.env.FRONT_END_URL}?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`,
			);
	}
}
