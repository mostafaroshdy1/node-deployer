const providers = {
  github: {
    rootUrl: 'https://github.com/login/oauth/authorize',
    options: {
      client_id:
        // process.env.GITHUB_CLIENT_ID ||
        'Iv23liqUDYtLQ7fnv5AE',
      client_secret:
        // process.env.GITHUB_CLIENT_SECRET ||
        '8e5dee56521604c05e3c9abe6920d3de6a5603e5',
      redirect_uri:
        // process.env.GITHUB_CALLBACK_URL ||
        'http://localhost:3000/auth/github/callback',
      scope: 'scope',
    },
    repoApi: 'https://api.github.com/user/repos',
    userApi: 'https://api.github.com/user',
  },
  gitlab: {
    rootUrl: 'https://gitlab.com/oauth/authorize',
    options: {
      client_id:
        // process.env.GITLAB_CLIENT_ID ||
        '5c46fc02c1721cf0903ebe3304252aa6272687d8b5fc2bda88bed9774278adea',
      client_secret:
        // process.env.GITLAB_CLIENT_SECRET ||
        'gloas-71c900ef432876383ad6dd21066757f06b4ea6f585c325130d1fd33af7b2014e',
      redirect_uri:
        // process.env.GITLAB_CALLBACK_URL ||
        'http://localhost:3000/auth/gitlab/callback',
      scope: 'api read_api read_user sudo',
      response_type: 'code',
    },
    repoApi: 'https://gitlab.com/api/v4/projects?owned=true',
    userApi: 'https://gitlab.com/api/v4/user',
  },
};

export default providers;
