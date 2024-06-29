import { Test, TestingModule } from '@nestjs/testing';
import { DeploymentService } from '../../src/services/deployment.service';
import { RepoService } from '../../src/services/repo.service';
import { DockerImageService } from '../../src/services/dockerImage.service';
import { TierService } from '../../src/services/tier.service';
import { UserService } from '../../src/services/user.service';
import { ContainerService } from '../../src/services/container.service';
import { DashboardService } from '../../src/services/dashboard.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('DeploymentService', () => {
  let service: DeploymentService;
  let repoService: RepoService;
  let dockerImageService: DockerImageService;
  let tierService: TierService;
  let userService: UserService;
  let containerService: ContainerService;
  let dashboardService: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeploymentService,
        {
          provide: RepoService,
          useValue: {
            findById: jest.fn(),
            findWhere: jest.fn(),
            cloneRepo: jest.fn(),
          },
        },
        {
          provide: DockerImageService,
          useValue: {
            create: jest.fn(),
            findByRepoId: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: TierService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: ContainerService,
          useValue: {
            create: jest.fn(),
            findByImageId: jest.fn(),
            removeByImageId: jest.fn(),
          },
        },
        {
          provide: DashboardService,
          useValue: {
            addObserver: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DeploymentService>(DeploymentService);
    repoService = module.get<RepoService>(RepoService);
    dockerImageService = module.get<DockerImageService>(DockerImageService);
    tierService = module.get<TierService>(TierService);
    userService = module.get<UserService>(UserService);
    containerService = module.get<ContainerService>(ContainerService);
    dashboardService = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined(); // Test Case 1
  });

  describe('deploy', () => {
    it('should deploy a new container', async () => {
      const repo = { id: 'repo1', userId: 'user1', nodeVersion: '14' } as any;
      const user = { id: 'user1', balance: 50 } as any;
      const tier = { id: 'tier1', price: 25 } as any;
      const image = { id: 'image1' } as any;
      const container = { id: 'container1', ip: '127.0.0.1', port: '8080' } as any;

      jest.spyOn(repoService, 'findById').mockResolvedValue(repo);
      jest.spyOn(userService, 'findById').mockResolvedValue(user);
      jest.spyOn(tierService, 'findById').mockResolvedValue(tier);
      jest.spyOn(dockerImageService, 'create').mockResolvedValue(image);
      jest.spyOn(containerService, 'create').mockResolvedValue(container);

      const result = await service.deploy('repo1', 'user1', 'tier1');
      expect(result).toEqual(container); // Test Case 2
    });

    it('should throw UnauthorizedException if user does not own the repo', async () => {
      const repo = { id: 'repo1', userId: 'user2', nodeVersion: '14' } as any;
      jest.spyOn(repoService, 'findById').mockResolvedValue(repo);

      await expect(service.deploy('repo1', 'user1', 'tier1')).rejects.toThrow(UnauthorizedException); // Test Case 3
    });

    it('should throw BadRequestException if user has insufficient balance', async () => {
      const repo = { id: 'repo1', userId: 'user1', nodeVersion: '14' } as any;
      const user = { id: 'user1', balance: 10 } as any;
      const tier = { id: 'tier1', price: 25 } as any;

      jest.spyOn(repoService, 'findById').mockResolvedValue(repo);
      jest.spyOn(userService, 'findById').mockResolvedValue(user);
      jest.spyOn(tierService, 'findById').mockResolvedValue(tier);

      await expect(service.deploy('repo1', 'user1', 'tier1')).rejects.toThrow(BadRequestException); // Test Case 4
    });
  });
});
