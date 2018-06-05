const env = process.env.NODE_ENV || 'development';

const config = {
	test: {
		applicationId: process.env.FB_APP_ID,
		appSecret: process.env.FB_APP_SECRET,
		accessToken: process.env.FB_PAGE_ACCESS_TOKEN,
		verifyToken: process.env.FB_VERIFY_TOKEN,
		chatExtensionHomeUrl: 'https://andybot.org',
		hostname: 'bots.pagekite.me',
		staticUrl: 'https://static.andybot.org/static/',
		apiEndpoint: 'http://localhost:3001',
		trustedDomain: 'https://andybot.org'
	},
	development: {
		applicationId: process.env.FB_APP_ID,
		appSecret: process.env.FB_APP_SECRET,
		accessToken: process.env.FB_PAGE_ACCESS_TOKEN,
		verifyToken: process.env.FB_VERIFY_TOKEN,
		chatExtensionHomeUrl: 'https://andybot.org',
		hostname: 'bots.pagekite.me',
		staticUrl: 'https://static.andybot.org/static/',
		apiEndpoint: 'http://localhost:3001',
		trustedDomain: 'https://andybot.org'
	},
	production: {        
		applicationId: process.env.FB_APP_ID,
		appSecret: process.env.FB_APP_SECRET,
		accessToken: process.env.FB_PAGE_ACCESS_TOKEN,
		verifyToken: process.env.FB_VERIFY_TOKEN,
		chatExtensionHomeUrl: 'https://carnegiebot.org',
		hostname: 'bots-b681d.carnegiebot.org',
		staticUrl: 'https://static.andybot.org/static/',
		apiEndpoint: 'https://api.carnegiebot.org',
		trustedDomain: 'https://carnegiebot.org'
	},
	sam : {
		applicationId: process.env.FB_APP_ID,
		appSecret: process.env.FB_APP_SECRET,
		accessToken: process.env.FB_PAGE_ACCESS_TOKEN,
		verifyToken: process.env.FB_VERIFY_TOKEN,
		chatExtensionHomeUrl: 'https://carnegiebot.org',
		hostname: 'c1c3ec81.ngrok.io',
		staticUrl: 'https://static.andybot.org/static/',
		apiEndpoint: 'http://localhost:3001',
		trustedDomain: 'https://carnegiebot.org'
	}
};

module.exports = config[env];