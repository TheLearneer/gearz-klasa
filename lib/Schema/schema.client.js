const { Client } = require('klasa');

Client.defaultClientSchema

	// Giveaway
	.add('giveaways', 'any', { array: true })

	// upvoters
	.add('upvoters', upvoters => upvoters
		.add('dbl', 'User', { array: true, default: [] }));
