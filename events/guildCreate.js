const { Event } = require('klasa');

class GuildCreateEvent extends Event {

	async run(guild) {
		return await this.client.helper.Logger.logGuildChange(guild);
	}

}

module.exports = GuildCreateEvent;
