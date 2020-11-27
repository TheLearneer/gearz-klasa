const { Client } = require('klasa');

Client.defaultMemberSchema

	// Economy System i.e. Points and Level
	.add('level', 'Integer', { deafult: 1 })
	.add('xp', 'Integer', { default: 0 });
/*
	// Warnings, kicks and bans; mostly for guild's automod system
	.add('warns', Warns => Warns
		.add('total', 'Integer', { deafult: 0 })
		.add('current', 'Integer', { default: 0 }))
	.add('kicks', 'Integer', { default: 0 })
	.add('bans', 'Integer', { deafult: 0 });
*/
/*
// Points and level
	.add('points', 'Integer', { default: 0 })
	.add('level', 'Integer', { default: 1 });
	*/
