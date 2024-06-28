import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { Observer } from '../interfaces/observer.interface';

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
    try {
      const response = await axios.get(
        `https://${provider}.com/api/v4/projects`,
        {
          params: { owned: true },
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
    try {
      const response = await axios.get(`https://${provider}.com/api/v4/user`, {
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

  async getExistingWebhooks(
    provider: string,
    accessToken: string,
    repoId: string,
  ) {
    try {
      const response = await axios.get(
        `https://${provider}.com/api/v4/projects/${repoId}/hooks`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching webhooks from ${provider} repository:` + error,
      );
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
      const existingWebhooks = await this.getExistingWebhooks(
        provider,
        accessToken,
        repoId,
      );

      const webhookExists = existingWebhooks.some(
        (webhook: any) => webhook.url === webhookUrl,
      );

      if (webhookExists) {
        return { message: 'Webhook already exists' };
      }

      const webhookData = {
        url: webhookUrl,
        push_events: true,
      };
      const response = await axios.post(
        `https://${provider}.com/api/v4/projects/${repoId}/hooks`,
        webhookData,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return response.data;
    } catch (error) {
      console.error(`Error adding webhook to ${provider} repository:`, error);
      throw new InternalServerErrorException(
        `Failed to add webhook to ${provider} repository: ` + error,
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
        `Error adding webhooks to all ${provider} repositories:` + error,
      );
      throw new InternalServerErrorException(
        `Failed to add webhooks to all ${provider} repositories: ` + error,
      );
    }
  }
}
