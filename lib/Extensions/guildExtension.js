const { Structures } = require('discord.js');
const Music = require('../Music');

module.exports = Structures.extend('Guild', Guild => {
	class newGuild extends Guild {

		constructor(...args) {
			super(...args);
			this.music = new Music(this);
		}

	}
	return newGuild;
});
