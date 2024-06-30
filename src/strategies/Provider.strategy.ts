import { Injectable } from '@nestjs/common';
import axios, { AxiosPromise } from 'axios';
import ProviderInterface from 'src/interfaces/Provider.interface';

@Injectable()
export class ProviderStrategy {
	private strategy: ProviderInterface;
	public setStrategy(strategy: ProviderInterface) {
		this.strategy = strategy;
	}
	public addWebHook(webhookUrl: string, repoId: number | string, accessToken: string) {
		return this.strategy.addWebHook(webhookUrl, repoId, accessToken);
	}

	public getWebHook(repoId: number | string, accessToken: string) {
		return this.strategy.getWebHook(repoId, accessToken);
	}
}

export class GithubWebhook implements ProviderInterface {
	async getWebHook(repoId: string | number, accessToken: string): AxiosPromise {
		const { headers, url } = await this.webhookData(repoId, accessToken);
		return axios.get(url, { headers });
	}

	async addWebHook(webhookUrl: string, repoId: string | number, accessToken: string): AxiosPromise {
		const { headers, url } = await this.webhookData(repoId, accessToken);
		const data = {
			name: 'web',
			active: true,
			events: ['push', 'pull_request'],
			config: {
				url: webhookUrl,
				content_type: 'json',
			},
		};

		return axios.post(url, data, { headers });
	}

	async webhookData(repoId: string | number, accessToken: string) {
		const headers = {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		};
		const { login: owner } = (await axios.get('https://api.github.com/user', { headers })).data;
		const url = `https://api.github.com/repos/${owner}/${repoId}/hooks`;

		return { headers, url };
	}
}

export class GitlabWebhook implements ProviderInterface {
	async getWebHook(repoId: string | number, accessToken: string): AxiosPromise {
	  return axios.get(`https://gitlab.com/api/v4/projects/${repoId}/hooks`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
	}
	async addWebHook(webhookUrl: string, repoId: string | number, accessToken: string): AxiosPromise {
		const webhookData = {
			url: webhookUrl,
			push_events: true,
		};
		return axios.post(`https://gitlab.com/api/v4/projects/${repoId}/hooks`, webhookData, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
	}
}
