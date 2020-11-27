// The options to be fed into client's constructor
exports.options = {
	// d.js client options
	disableEveryone: true,
	presence: {
		status: 'online',
		activity: {
			name: 'gearzbot.me',
			url: 'https://gearzbot.me',
			type: 'WATCHING'
		}
	},
	// klasa client options
	commandEditing: true,
	commandLogging: true,
	prefix: '?',
	regexPrefix: /^(hey )?(gearz)(,|!)/i,
	// change gearz to your bot's name in above line.
	pieceDefaults: {
		commands: {
			deletable: true,
			autoAliases: true
		}
	},
	providers: {
		default: 'json',
		postgresql: {
			host: '',
			port: 5432,
			db: '',
			user: '',
			password: '',
			options: {
				max: 20,
				idleTimeoutMillis: 30000,
				connectionTimeoutMillis: 2000
			}
		}
	}
};

// Custom options for some customized behavious and checks
exports.config = {
	// Logging options
	loggingOptions: {
		guildLogger: true,
		dblUpvoteLogger: true,
		errorLogger: false
	},
	postStatsToLists: true
};

// Different keys used in the bot (WHICH MUST BE KEPT SAFE AT EVERY COST)
exports.keys = {
	// The discord token of production app
	Token: '',
	// The discord token of development app
	DevToken: '',

	/* BOT LIST TOKENS */
	// In tasks/botGuildPoster comment out the lists where your bot isn't listed
	// https://discordbots.org
	DBLToken: '',
	// https://bots.discord.pw
	DBPWToken: '',
	// https://listcord.com
	ListcordToken: '',
	// https://Botsfordiscord.com
	B4DToken: '',
	// https://botlist.space
	BotSpace: '',
	// https://discordboats.club
	DBoats: '',
	// https://discord.services
	DService: '',


	/* OTHER API TOKENS */
	// https://Weeb.sh
	Weeb: '',
	// Mashape service
	Mashape: '',
	// Wordnik
	Wordnik: '',
	// https://royaleapi.com
	RoyaleAPI: '',
	// Open Weather Map
	OpenWeatherMap: '',
	// Hypixel
	Hypixel: '',
	// Fortnite
	Fortnite: '',
	// Giphy
	Giphy: '',
	// Imgur
	Imgur: '',
	// Twitter
	Twitter: { key: '', secret: '' },
	// Instagram
	Instagram: { id: '', secret: '' },
	// Oxford dicrionary
	Oxford: { id: '', key: '' },
	// Google services
	Google: { youtube: '' },
	// Key to confirm the upvote request is coming from DBL.
	// TO-BE-DONE add the actual key here...
	dblUpvoteConfirmation: 'Special key here',


	/* WEBHOOKS */
	webhooks: {
		// TO-BE-DONE : Change the ID and token for webhooks to production one instead of development one.
		guildLogger: { id: '', token: '' },
		dblUpvoteLogger: { id: '', token: '' }
	}
};
