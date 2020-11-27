const { Client } = require('klasa');

Client.defaultGuildSchema

	// Moderation logs
	.add('moderation', moderation => moderation
		.add('logs', 'Boolean', { default: false })
		.add('channel', 'TextChannel', { default: null })
		.add('confirmation', 'Boolean', { default: true }))

	// Auto Moderation
	.add('autoMod', autoMod => autoMod
		// Anti invite system
		.add('antiInvite', antiInvite => antiInvite
			.add('enabled', 'Boolean', { default: false })
			.add('whitelisted', 'String', { array: true, default: [] })
			.add('ignoreChannels', 'TextChannel', { array: true, default: [] }))
		// Nickname hoisers dehoisting system
		.add('dehoisting', dehoisting => dehoisting
			.add('enabled', 'Boolean', { default: false })
			.add('nickname', 'String', { default: 'Hoister no hoisting...' })))

	// Starboard
	.add('starboard', starboard => starboard
		.add('enabled', 'Boolean', { default: false })
		.add('noSelfStar', 'Boolean', { default: false })
		.add('channel', 'TextChannel', { default: null })
		.add('minimum', 'Integer', { default: 3 })
		.add('ignoreChannels', 'TextChannel', { array: true, default: [] }))

	// User logging: Join & Leave
	.add('userLogs', userLogs => userLogs
		// Channel to display the logs
		.add('channel', 'TextChannel', { default: null })
		// customization options for user joining
		.add('join', join => join
			.add('enabled', 'Boolean', { default: false })
			.add('message', 'String', { default: 'Welcome {user:name} to this amazing place which is known as {server}.' }))
		// customization options for user leaving
		.add('leave', leave => leave
			.add('enabled', 'Boolean', { default: false })
			.add('message', 'String', { default: 'ByeBye {user:name}! We hope you enjoyed with us.' }))
		// customization options for DM gretting on user joining
		.add('dm', dm => dm
			.add('enabled', 'Boolean', { default: false })
			.add('message', 'String', { default: 'Here are some greetings all the way from {server}!' }))
		// What options to be displayed during greeting/farewell message
		.add('display', display => display
			.add('image', 'Boolean', { default: false })
			.add('text', 'Boolean', { default: false })
			.add('imageID', 'String', { default: 'default' })))

	// Auto Role
	.add('autoRole', autoRole => autoRole
		.add('enabled', 'Boolean', { default: false })
		.add('roles', 'Role', { array: true, default: [] }))

	// Economy system
	.add('economy', economy => economy
		.add('enabled', 'Boolean', { default: false })
		.add('ignoreChannels', 'TextChannel', { array: true, default: [] })
		.add('ignoreRoles', 'Role', { array: true, default: [] })
		.add('rewards', 'any', { array: true })
		.add('levelNotice', levelNotice => levelNotice
			.add('enabled', 'Boolean', { default: false })
			.add('message', 'String', { default: 'Congrats {member}! You just levelled up to level {level}.' })));
