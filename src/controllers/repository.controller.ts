import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GitLabRepoStrategy } from 'src/strategies/gitlab-repo.strategy';


@Controller('repositories')
export class RepositoryController {
  constructor(private readonly gitLabRepoStrategy: GitLabRepoStrategy) {}

  @Get('list')
  @UseGuards(AuthGuard('gitlab-repo'))
  async getRepositories(@Req() req: Request) {
    try {
      // User is authenticated and repositories are fetched in GitLabRepoStrategy.validate()
      const repositories = req.user;

      if (Array.isArray(repositories)) {
        repositories.forEach(repo => {
          console.log(`Repository Name: ${repo.name}`);
          console.log(`Repository Description: ${repo.description}`);
          console.log(`Repository URL: ${repo.web_url}`);
          console.log('---------------------');
        });
      } else {
        console.error('Invalid repositories data');
      }

      // Return repositories as response (optional)
      return repositories;
    } catch (error) {
      // Handle errors
      console.error('Error fetching repositories:', error);
      throw error; // Optionally handle and throw a custom exception
    }
  }
}
