const { Client } = require('klasa');

Client.defaultUserSchema

	// Economy; mostly for game commands that require coins
	.add('economy', economy => economy
		.add('coins', 'Integer', { default: 50 })
		.add('daily', 'Integer', { default: 1533560027606 }))

	// User profile specifications
	.add('profile', profile => profile
		.add('bg', 'String', { default: 'default' })
		.add('intro', 'String', { default: 'Someone who love Gearz.' })
		.add('medals', 'String', { array: true, default: ['user'] }))

	// Gamestat keys, Not sure if this will be used tbh.
	.add('gameStats', gameStats => gameStats
		.add('royale', 'String'))

	// AFK system
	.add('afk', afk => afk
		.add('enabled', 'Boolean', { default: false })
		.add('message', 'String', { default: 'Please don\'t disturb...' }));
