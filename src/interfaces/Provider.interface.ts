import { AxiosPromise } from 'axios';

export default interface ProviderInterface {
	addWebHook(webhookUrl: string, repoId: number | string, accessToken: string): AxiosPromise;
}
