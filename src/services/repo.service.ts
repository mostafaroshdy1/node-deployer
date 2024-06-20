import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RepoService {
  constructor() {}
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
        error.response.data,
      );
      throw new InternalServerErrorException(
        `Failed to fetch ${provider} repositories: ` +
          error.response.data.error_description,
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
      console.error(`Error fetching ${provider} user`, error.response.data);
      throw new InternalServerErrorException(
        `Failed to fetch ${provider} user: ` +
          error.response.data.error_description,
      );
    }
  }
}
