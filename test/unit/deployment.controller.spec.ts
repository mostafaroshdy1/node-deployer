import { Test, TestingModule } from '@nestjs/testing';
import { DeploymentController } from '../../src/controllers/deployment.controller';
import { DeploymentService } from '../../src/services/deployment.service';
import { ContainerService } from '../../src/services/container.service';
import { CustomRequest } from '../../src/interfaces/custom-request.interface';
import { Container, Repo, DockerStatus } from '@prisma/client';

describe('DeploymentController', () => {
  let controller: DeploymentController;
  let deploymentService: DeploymentService;
  let containerService: ContainerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeploymentController],
      providers: [
        {
          provide: DeploymentService,
          useValue: {
            deploy: jest.fn(),
            findAllContainersByUserId: jest.fn(),
            redeploy: jest.fn(),
          },
        },
        {
          provide: ContainerService,
          useValue: {
            remove: jest.fn(),
            stopContainer: jest.fn(),
            resumeContainer: jest.fn(),
            getContainerLogs: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DeploymentController>(DeploymentController);
    deploymentService = module.get<DeploymentService>(DeploymentService);
    containerService = module.get<ContainerService>(ContainerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createContainer', () => {
    it('should create a container', async () => {
      const container = { ip: '127.0.0.1', port: '8080' } as any;
      jest.spyOn(deploymentService, 'deploy').mockResolvedValue(container);

      const body = {
        repoId: 'repo1',
        tierId: 'tier1',
      };
      const guardReq = { userId: 'user1' } as CustomRequest;

      const result = await controller.createContainer(body, guardReq);
      expect(result).toEqual({ ipAddress: '127.0.0.1:8080' });
    });
  });

  describe('getContainer', () => {
    it('should get containers for a user', async () => {
      const repos = [{
        id: 'repo1',
        url: 'https://example.com/repo1',
        userId: 'user1',
        name: 'repo1',
        repoId: 'repoId1',
        event: 'event1',
        env: 'env1',
        nodeVersion: '14',
        createdAt: new Date(),
        updatedAt: new Date(),
        dockerImage: {
          id: 'image1',
          repoId: 'repo1',
          createdAt: new Date(),
          updatedAt: new Date(),
          Containers: [
            {
              id: 'container1',
              dockerImageId: 'image1',
              port: '8080',
              ip: '127.0.0.1',
              tier: {
                id: 'tier1',
                name: 'tier1',
                price: 25,
                cpu: '0.5',
                memory: '512M',
                createdAt: new Date(),
                updatedAt: new Date()
              },
              tierId: 'tier1',
              status: DockerStatus.up,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
      }];

      jest.spyOn(deploymentService, 'findAllContainersByUserId').mockResolvedValue(repos);

      const req = { userId: 'user1' } as CustomRequest;
      const result = await controller.getContainer(req);
      expect(result).toEqual(repos);
    });
  });

  describe('redeployContainer', () => {
    it('should redeploy a container', async () => {
      const containers = [{ id: 'container1' }] as Container[];
      jest.spyOn(deploymentService, 'redeploy').mockResolvedValue(containers);

      const body = {
        userId: 'user1',
        repoId: 'repo1',
      };

      const result = await controller.redeployContainer(body);
      expect(result).toEqual(containers);
    });
  });

  describe('deleteContainer', () => {
    it('should delete a container', async () => {
      const container = { id: 'container1' } as Container;
      jest.spyOn(containerService, 'remove').mockResolvedValue(container);

      const result = await controller.deleteContainer('container1');
      expect(result).toEqual(container);
    });
  });

  describe('stopContainer', () => {
    it('should stop a container', async () => {
      const container = { id: 'container1' } as Container;
      jest.spyOn(containerService, 'stopContainer').mockResolvedValue(container);

      const req = { userId: 'user1' } as CustomRequest;
      const result = await controller.stopContainer('container1', req);
      expect(result).toEqual({ containerId: 'container1' });
    });
  });
});
