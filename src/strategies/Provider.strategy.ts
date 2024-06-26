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
}

export class GithubWebhook implements ProviderInterface {
	async addWebHook(webhookUrl: string, repoId: string | number, accessToken: string): AxiosPromise {
		const headers = {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		};

		const { login: owner } = (await axios.get('https://api.github.com/user', { headers })).data;
		// const owner = 'Belal-Abo-Ata';

		const url = `https://api.github.com/repos/${owner}/${repoId}/hooks`;

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
}

export class GitlabWebhook implements ProviderInterface {
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
