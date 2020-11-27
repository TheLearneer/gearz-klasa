const { Event } = require('klasa');

class GuildDeleteEvent extends Event {

	async run(guild) {
		return await this.client.helper.Logger.logGuildChange(guild, false);
	}

}

module.exports = GuildDeleteEvent;
