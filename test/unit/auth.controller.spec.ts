import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/controllers/auth.controller'; 
import { AuthService } from '../../src/services/auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            createJwtTokens: jest.fn(),
            getRedirectUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should call createJwtTokens on authRedirect', async () => {
    const user = { id: 1, email: 'test@test.com' };
    const req = { user, params: { provider: 'github' } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      redirect: jest.fn(),
    } as any;
    const tokens = { access_token: 'token' };
    jest.spyOn(authService, 'createJwtTokens').mockResolvedValue(tokens);

    await authController.authRedirect(req, res);

    expect(authService.createJwtTokens).toHaveBeenCalledWith(user);
    expect(res.status).toHaveBeenCalledWith(302);
    expect(res.redirect).toHaveBeenCalledWith(
      `${process.env.FRONT_END_URL}/auth/callback?accessToken=token&provider=github`,
    );
  });

  it('should call getRedirectUrl on redirectUrl', async () => {
    const req = { params: { provider: 'github' } } as any;
    const res = { json: jest.fn() } as any;
    const url = 'https://github.com';
    jest.spyOn(authService, 'getRedirectUrl').mockResolvedValue(url);

    await authController.redirectUrl(req, res);

    expect(authService.getRedirectUrl).toHaveBeenCalledWith('github');
    expect(res.json).toHaveBeenCalledWith({ url });
  });
});
