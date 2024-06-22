const providers = {
	github: {
		rootUrl: 'https://github.com/login/oauth/authorize',
		options: {
			client_id: process.env.GITHUB_CLIENT_ID,
			redirect_uri: process.env.GITHUB_CALLBACK_URL,
			scope: 'scope',
		},
	},
	gitlab: {
		rootUrl: 'https://gitlab.com/oauth/authorize',
		options: {
			client_id: process.env.GITLAB_CLIENT_ID,
			redirect_uri: process.env.GITLAB_CALLBACK_URL,
			scope: 'api read_api read_user sudo',
			response_type: 'code',
		},
	},
};

export default providers;
