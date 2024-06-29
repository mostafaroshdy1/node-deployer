import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/services/auth.service'; 
import { UserService } from '../../src/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { DashboardService } from '../../src/services/dashboard.service';
import { UserEntity } from '../../src/entities/user.entity';
import { Role } from '@prisma/client';

describe('AuthService', () => {
    let authService: AuthService;
    let userService: UserService;
    let jwtService: JwtService;
    let dashboardService: DashboardService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AuthService,
          {
            provide: UserService,
            useValue: {
              findByEmailAndProvider: jest.fn(),
              update: jest.fn(),
              create: jest.fn(),
              findById: jest.fn(),
            },
          },
          {
            provide: JwtService,
            useValue: {
              signAsync: jest.fn(),
            },
          },
          {
            provide: DashboardService,
            useValue: {
              getProviderRepos: jest.fn(),
            },
          },
        ],
      }).compile();
  
      authService = module.get<AuthService>(AuthService);
      userService = module.get<UserService>(UserService);
      jwtService = module.get<JwtService>(JwtService);
      dashboardService = module.get<DashboardService>(DashboardService);
    });
  
    it('should be defined', () => {
      expect(authService).toBeDefined();
    });
  
    it('should create JWT tokens', async () => {
      const user: UserEntity = {
        id: '1',
        email: 'test@test.com',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        provider: 'github',
        providerId: '123',
        username: 'testuser',
        name: 'Test User',
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
        balance: 0
      };
      const token = 'token';
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);
  
      const result = await authService.createJwtTokens(user);
  
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        {
          id: user.id,
          email: user.email,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        },
        {
          expiresIn: process.env.JWT_EXPIRATION,
        },
      );
      expect(result).toEqual({ access_token: token });
    });
  
    it('should handle invalid provider in getRedirectUrl', async () => {
      await expect(authService.getRedirectUrl('invalidProvider')).rejects.toThrow(
        'Unsupported provider: invalidProvider',
      );
    });
  
    
  });