import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Observer } from '../interfaces/observer.interface';
import providers from 'src/common/types/providers';
import { ProviderStrategy,  GithubWebhook, GitlabWebhook } from 'src/strategies/Provider.strategy';
import ProviderInterface from 'src/interfaces/Provider.interface';

@Injectable()
export class DashboardService {
  constructor() {}
  private observers: Observer[] = [];

  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notifyObservers(event: string): void {
    for (const observer of this.observers) {
      observer.update(event);
    }
  }

  async getProviderRepos(provider: string, accessToken: string) {
    const {repoApi: url} = providers[provider]
    try {
      const response = await axios.get(
            url,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching ${provider} repositories:`,
        error.response ? error.response.data : error.message,
      );
      throw new InternalServerErrorException(
        `Failed to fetch ${provider} repositories: ` +
          (error.response
            ? error.response.data.error_description
            : error.message),
      );
    }
  }

  async getProviderUser(provider: string, accessToken: string) {
    const {userApi: url} = providers[provider]
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching ${provider} user`,
        error.response ? error.response.data : error.message,
      );
      throw new InternalServerErrorException(
        `Failed to fetch ${provider} user: ` +
          (error.response
            ? error.response.data.error_description
            : error.message),
      );
    }
  }

  async addWebhookToRepo(
    provider: string,
    accessToken: string,
    repoId: number | string,
    webhookUrl: string,
  ) {
    try {
      const providerStrategy = new ProviderStrategy();
      let providerStrategyWebhook!: ProviderInterface;
      if (provider === 'github') {
        providerStrategyWebhook = new GithubWebhook() 
      } else if (provider === 'gitlab') {
        providerStrategyWebhook = new GitlabWebhook() 
      } else {
        throw new BadRequestException();
      }


      providerStrategy.setStrategy(providerStrategyWebhook);
      const response: AxiosResponse = await providerStrategy.addWebHook(webhookUrl, repoId, accessToken)
      return response.data;
    } catch (error) {
      console.error(
        `Error adding webhook to ${provider} repository:`,
        error.response ? error.response.data : error.message,
      );
      throw new InternalServerErrorException(
        `Failed to add webhook to ${provider} repository: ` +
          (error.response
            ? error.response.data.error_description
            : error.message),
      );
    }
  }

  async addWebhooksToAllRepos(
    provider: string,
    accessToken: string,
    webhookUrl: string,
  ) {
    try {
      const repos = await this.getProviderRepos(provider, accessToken);
      const results = [];
      for (const repo of repos) {
        const result = await this.addWebhookToRepo(
          provider,
          accessToken,
          repo.id,
          webhookUrl,
        );
        results.push(result);
      }
      return results;
    } catch (error) {
      console.error(
        `Error adding webhooks to all ${provider} repositories:`,
        error.response ? error.response.data : error.message,
      );
      throw new InternalServerErrorException(
        `Failed to add webhooks to all ${provider} repositories: ` +
          (error.response
            ? error.response.data.error_description
            : error.message),
      );
    }
  }
}
