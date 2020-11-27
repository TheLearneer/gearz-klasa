const { Task } = require('klasa');
const Giveaway = require('../lib/Giveaway');

class GiveawayTask extends Task {

	async run() {
		const { giveaways } = this.client.settings;
		if (giveaways.length < 1) return;

		for (const giv of giveaways) {
			// Delete the giveaway if it's been 48+ hours since the giveaway ended.
			if (typeof giv.endTimestamp === 'number' && Date.now() > giv.endTimestamp + (1000 * 60 * 60 * 48)) await this.updateGiv(giv);
			// End the giveaway if the time for the giveaway is over.
			else if (Date.now() >= giv.startTimestamp + giv.duration) await this.endGiveaway(giv);
			// Update the giveaway embed if giveaway hasn't ended.
			else await this.updateGiveawayEmbed(giv);
		}
	}

	async updateGiveawayEmbed(giv) {
		const valid = await this.checkValid(giv);
		if (!valid) return;

		// Getting the embed and updating the current message.
		const embed = Giveaway.getEmbed(giv);
		// TO-BE-DONE verify the broadcastEval
		const allShard = await this.client.shard.broadcastEval(`this.guilds.get('${giv.guild}').channels.get('${giv.channel}').messages.fetch('${giv.message}')`);
		const msg = allShard.filter(data => data !== null)[0];

		// TO-BE-DONE
		// Need to check if the old embed in the message is exactly same as the new embed generated.
		// If both the embeds are same, then no need to update the message.
		msg.update(embed);
	}

	async endGiveaway(giv) {
		const valid = await this.checkValid(giv);
		if (!valid) return;

		// Removing the giveaway from the client settings storage.
		await this.updateGiv(giv);

		// updating the giveaway with further informations
		const giveaway = await new Giveaway()
			.loadFromObject(giv)
			.setEndTime();

		// Getting the winners (valid i.e. members on guild) only and the final embed as well.
		const embed = await giveaway.drawWinners().getWinnersEmbed();

		// again adding the giveaway information to the client setting storage for next 48 hours incase the winners needs to be redrawn.
		await this.updateGiv(giveaway.toJSON());

		// TO-BE-DONE verify the broadcastEval
		const allShard = await this.client.shard.broadcastEval(`this.guilds.get('${giv.guild}').channels.get('${giv.channel}').messages.fetch('${giv.message}')`);
		const msg = allShard.filter(data => data !== null)[0];
		await msg.update(embed);
	}

	async checkValid(giv) {
		const { guild, channel, message } = giv;
		// Checking if the guild, channel and message objects are still findable
		// TO-BE-DONE verify the broadcastEval
		const allShards = await this.client.shard.broadcastEval(`
			const guildS = this.guilds.get('${guild}');
			if (!guildS) return false;
			const channelS = guildS.channels.get('${channel}');
			if (!channelS) return false;
			const msgS = await channelS.messages.fetch('${message}');
			if (!msgS) return false;
			return true;
		`);
		const valid = allShards.filter(shard => shard === true).length;
		if (valid < 1) {
			await this.updateGiv(giv);
			return false;
		}
		return true;
		/*
			guild = this.client.guilds.get(guild);
			if (!guild) {
				await this.updateGiv(giv);
				return false;
			}
			channel = guild.channels.get(channel);
			// Deleting the giveaway as if the channel is deleted, there is no way the giveaway can be continued.
			if (!channel) {
				await this.updateGiv(giv);
				return false;
			}
			message = channel.messages.fetch(message);
			// Deleting the giveaway as if the message is deleted, there is no way the giveaway can be continued.
			if (!message) {
				await this.updateGiv(giv);
				return false;
			}
			// Well all those needed properties are available.
			return true;
		*/
	}

	async updateGiv(giv) {
		await this.client.settings.update('giveaways', giv);
	}

}

module.exports = GiveawayTask;
