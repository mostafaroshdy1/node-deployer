import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { RepoService } from 'src/services/repo.service';
// import { DynamicAuthGuard } from 'src/common/guards/dynamic-auth.guard';

@Controller('repo')
export class RepoController {
  constructor(private readonly repoService: RepoService) {}

  @Get(':provider/callback')
  // @UseGuards(DynamicAuthGuard)
  async providerReposCallback(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.headers.authorization.split(' ')[1];
    const provider = req.params.provider;

    try {
      const repos = await this.repoService.getProviderRepos(
        provider,
        accessToken,
      );
      const user = await this.repoService.getProviderUser(
        provider,
        accessToken,
      );
      const response = {
        user: user,
        repos: repos,
      };
      return res.json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
