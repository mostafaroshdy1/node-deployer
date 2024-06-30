import {
  Controller,
  Get,
  Req,
  Res,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DashboardService } from 'src/services/dashboard.service';
import { RepoService } from 'src/services/repo.service';
import { ConcreteObserver } from '../observers/concrete.observer';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CustomRequest } from '../interfaces/custom-request.interface';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly repoService: RepoService,
  ) {
    const observer = new ConcreteObserver();
    this.dashboardService.addObserver(observer);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':provider')
  async providerReposCallback(
    @Req() req: Request,
    @Req() guardReq: CustomRequest,
    @Res() res: Response,
  ) {
    try {
      console.log('Received provider callback');
      const { accessToken } = guardReq;
      const provider = req.params.provider;

      const repos = await this.dashboardService.getProviderRepos(
        provider,
        accessToken,
      );

      const user = await this.dashboardService.getProviderUser(
        provider,
        accessToken,
      );

      return res.json({ user, repos });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('repos/url')
  async getUserRepo(@Req() guardReq: CustomRequest, @Res() res: Response) {
    try {
      const result = await this.repoService.findAll();
      console.log(result);
      const userId = guardReq.userId;
      const userRepo = result.filter((user) => user.userId === userId);
      const repoUrl = userRepo.map((repo) => repo.url);
      return res.json(repoUrl);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':provider/webhooks')
  async addWebhooks(
    @Param('provider') provider: string,
    @Body('repoId') repoId: string,
    @Body('webhookUrl') webhookUrl: string,
    @Req() req: Request,
    @Req() guardReq: CustomRequest,
    @Res() res: Response,
  ) {
    try {
      const { accessToken } = guardReq;
      const result = await this.dashboardService.addWebhookToRepo(
        provider,
        accessToken,
        repoId,
        // process.env.WEBHOOKURL,
        webhookUrl
      );
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Post('/webhook')
  async handleWebhook(@Body() body: any, @Res() res: Response) {
    // console.log('Received webhook event:', body);
    const repo = body.project?.web_url || body.repository.url;
    const repoId = body.project?.id || body.project_id || body.repository.id;
    if (repoId) {
      await this.dashboardService.storeCommitData(repoId, body);
    }
    this.dashboardService.notifyObservers(repo);
    res.status(200).send('Webhook received');
  }

  @UseGuards(JwtAuthGuard)
  @Get('/commits/:repoId')
  async getCommitsByRepoId(
    @Param('repoId') repoId: string,
    @Res() res: Response,
  ) {
    try {
      const gitRepo = await this.repoService.findById(repoId);
      const commitData = await this.dashboardService.getCommitData(
        gitRepo.repoId,
      );
      return res.json(commitData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
