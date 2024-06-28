import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Observer } from '../interfaces/observer.interface';
import providers from 'src/common/types/providers';
import { ProviderStrategy, GithubWebhook, GitlabWebhook } from 'src/strategies/Provider.strategy';
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

  notifyObservers(event: string): string {
    for (const observer of this.observers) {
      observer.update(event);
    }
    return 'done';
  }

  async getProviderRepos(provider: string, accessToken: string) {
    const { repoApi: url } = providers[provider];
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching ${provider} repositories:`,
        error.response ? error.response.data : error.message,
      );
      throw new InternalServerErrorException(
        `Failed to fetch ${provider} repositories: ` +
          (error.response ? error.response.data.error_description : error.message),
      );
    }
  }

  async getProviderUser(provider: string, accessToken: string) {
    const { userApi: url } = providers[provider];
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
          (error.response ? error.response.data.error_description : error.message),
      );
    }
  }

  async getExistingWebhooks(provider: string, accessToken: string, repoId: string) {
    try {
      const providerStrategy = new ProviderStrategy();
      let providerStrategyWebhook!: ProviderInterface;
      if (provider === 'github') {
        providerStrategyWebhook = new GithubWebhook();
      } else if (provider === 'gitlab') {
        providerStrategyWebhook = new GitlabWebhook();
      } else {
        throw new BadRequestException();
      }

      providerStrategy.setStrategy(providerStrategyWebhook);
      const response: AxiosResponse = await providerStrategy.getWebHook(repoId, accessToken);
      return response.data;
    } catch (error) {
      console.error(`Error fetching webhooks from ${provider} repository:` + error);
      throw new InternalServerErrorException(
        `Failed to fetch webhooks from ${provider} repository: ` + error,
      );
    }
  }

  async addWebhookToRepo(
    provider: string,
    accessToken: string,
    repoId: string,
    webhookUrl: string,
  ) {
    try {
      const existingWebhooks = await this.getExistingWebhooks(provider, accessToken, repoId);
      console.log('existingWebhooks', existingWebhooks)

      let isWebhookExists;



      const providerStrategy = new ProviderStrategy();
      let providerStrategyWebhook!: ProviderInterface;
      if (provider === 'github') {
        providerStrategyWebhook = new GithubWebhook();
        isWebhookExists = existingWebhooks.some((webhook: any) => webhook.config.url === webhookUrl);
      } else if (provider === 'gitlab') {
        providerStrategyWebhook = new GitlabWebhook();
        isWebhookExists = existingWebhooks.some((webhook: any) => webhook.url === webhookUrl);
      } else {
        throw new BadRequestException();
      }


      if (isWebhookExists) {
        return { message: 'Webhook already exists' };
      }

      providerStrategy.setStrategy(providerStrategyWebhook);
      const response: AxiosResponse = await providerStrategy.addWebHook(
        webhookUrl,
        repoId,
        accessToken,
      );
      return response.data;
    } catch (error) {
      console.error(`Error adding webhook to ${provider} repository:`, error);
      throw new InternalServerErrorException(
        `Failed to add webhook to ${provider} repository: ` + error,
      );
    }
  }

  async addWebhooksToAllRepos(provider: string, accessToken: string, webhookUrl: string) {
    try {
      const repos = await this.getProviderRepos(provider, accessToken);
      const results = [];
      for (const repo of repos) {
        const result = await this.addWebhookToRepo(provider, accessToken, repo.id, webhookUrl);
        results.push(result);
      }
      return results;
    } catch (error) {
      console.error(`Error adding webhooks to all ${provider} repositories:` + error);
      throw new InternalServerErrorException(
        `Failed to add webhooks to all ${provider} repositories: ` + error,
      );
    }
  }
}
