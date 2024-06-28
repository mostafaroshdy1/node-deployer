const providers = {
  github: {
    rootUrl: 'https://github.com/login/oauth/authorize',
    options: {
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: process.env.GITHUB_CALLBACK_URL,
      scope: 'scope',
    },
    repoApi: 'https://api.github.com/user/repos',
    userApi: 'https://api.github.com/user',
  },
  gitlab: {
    rootUrl: 'https://gitlab.com/oauth/authorize',
    options: {
      client_id:
        process.env.GITLAB_CLIENT_ID ||
        '5c46fc02c1721cf0903ebe3304252aa6272687d8b5fc2bda88bed9774278adea',
      redirect_uri:
        process.env.GITLAB_CALLBACK_URL ||
        'http://localhost:3000/auth/gitlab/callback',
      scope: 'api read_api read_user sudo',
      response_type: 'code',
    },
    repoApi: 'https://gitlab.com/api/v4/projects?owned=true',
    userApi: 'https://gitlab.com/api/v4/user',
  },
};

export default providers;
