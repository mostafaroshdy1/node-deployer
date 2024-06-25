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
import { ConcreteObserver } from '../observers/concrete.observer';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CustomRequest } from '../interfaces/custom-request.interface';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {
    const observer = new ConcreteObserver();
    this.dashboardService.addObserver(observer);
  }

  @Get(':provider')
  async providerReposCallback(
    @Req() req: Request,
    @Req() guardReq: CustomRequest,
    @Res() res: Response,
  ) {
    try {
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

  @Post(':provider/webhooks')
  async addWebhooks(
    @Param('provider') provider: string,
    @Body('webhookUrl') webhookUrl: string,
    @Req() req: Request,
    @Req() guardReq: CustomRequest,
    @Res() res: Response,
  ) {
    try {
      const { accessToken } = guardReq;

      const results = await this.dashboardService.addWebhooksToAllRepos(
        provider,
        accessToken,
        webhookUrl,
      );

      return res.json(results);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Post('/webhook')
  async handleWebhook(@Body() body: any, @Res() res: Response) {
    console.log('Received webhook event:', body);
    // save to database
    this.dashboardService.notifyObservers(body);
    res.status(200).send('Webhook received');
  }
}
