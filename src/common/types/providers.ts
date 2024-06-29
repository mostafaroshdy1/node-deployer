const providers = {
  github: {
    rootUrl: 'https://github.com/login/oauth/authorize',
    options: {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      redirect_uri: process.env.GITHUB_CALLBACK_URL,
      scope: 'scope',
    },
    repoApi: 'https://api.github.com/user/repos?per_page=100',
    userApi: 'https://api.github.com/user',
  },
  gitlab: {
    rootUrl: 'https://gitlab.com/oauth/authorize',
    options: {
      client_id: process.env.GITLAB_CLIENT_ID,
      client_secret: process.env.GITLAB_CLIENT_SECRET,
      redirect_uri: process.env.GITLAB_CALLBACK_URL,
      scope: 'api read_api read_user sudo',
      response_type: 'code',
    },
    repoApi: 'https://gitlab.com/api/v4/projects?owned=true',
    userApi: 'https://gitlab.com/api/v4/user',
  },
};

export default providers;
