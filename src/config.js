const env = process.env.NODE_ENV || 'development';

const config = {
	test: {
		applicationId: process.env.FB_APP_ID,
		appSecret: process.env.FB_APP_SECRET,
		accessToken: process.env.FB_PAGE_ACCESS_TOKEN,
		verifyToken: process.env.FB_VERIFY_TOKEN,
		chatExtensionHomeUrl: 'https://andybot.org',
		hostname: 'bots.pagekite.me',
		staticUrl: 'https://carnegiebot.org/static/img/',
		apiEndpoint: 'http://localhost:3001',
		trustedDomain: 'https://andybot.org'
	},
	development: {
		applicationId: process.env.FB_APP_ID,
		appSecret: process.env.FB_APP_SECRET,
		accessToken: process.env.FB_PAGE_ACCESS_TOKEN,
		verifyToken: process.env.FB_VERIFY_TOKEN,
		chatExtensionHomeUrl: 'https://andybot.org',
		hostname: 'ae16137f.ngrok.io',
		staticUrl: 'https://carnegiebot.org/static/img/',
		apiEndpoint: 'http://localhost:3001',
		trustedDomain: 'https://carnegiebot.org'
	},
	production: {        
		applicationId: process.env.FB_APP_ID,
		appSecret: process.env.FB_APP_SECRET,
		accessToken: process.env.FB_PAGE_ACCESS_TOKEN,
		verifyToken: process.env.FB_VERIFY_TOKEN,
		chatExtensionHomeUrl: 'https://carnegiebot.org',
		hostname: 'bots-b681d.carnegiebot.org',
		staticUrl: 'https://carnegiebot.org/static/img/',
		apiEndpoint: 'https://api.carnegiebot.org',
		trustedDomain: 'https://carnegiebot.org'
	},
	sam : {
		applicationId: process.env.FB_APP_ID,
		appSecret: process.env.FB_APP_SECRET,
		accessToken: process.env.FB_PAGE_ACCESS_TOKEN,
		verifyToken: process.env.FB_VERIFY_TOKEN,
		chatExtensionHomeUrl: 'https://carnegiebot.org',
		hostname: '3b424d0e.ngrok.io',
		staticUrl: 'https://carnegiebot.org/static/img/',
		apiEndpoint: 'http://localhost:3001',
		trustedDomain: 'https://carnegiebot.org'
	}
};

module.exports = config[env];