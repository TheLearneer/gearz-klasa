/**
 * @file messageReactionRemove.js (Event)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Event } = require('klasa');
const { buildEmbed } = require('../lib/Starboard');

class MessageReactionRemoveEvent extends Event {

	async run(reaction, user) {
		switch (reaction.emoji.name) {
			case '⭐':
				return await this.handleStarboard(reaction, user);
			default:
				return null;
		}
	}

	async handleStarboard(reaction, user) {
		const { count, message } = reaction;

		// No need to worry if the reaction was from bot.
		if (user.bot) return null;

		// Exiting if the reaction was from the message author ownself
		if (user.id === message.author.id) return null;

		const set = message.guild.settings.starboard;
		const channel = message.guild.channels.get(set.channel);

		// Exiting the starboard with some early checks
		if (!set.enabled) return null;
		if (!channel) return null;
		if (set.ignoreChannels.includes(message.channel.id)) return null;

		// Editing the old starboard embed if exists and still has enough count, else deleting the embed
		const msgs = await channel.messages.fetch({ limit: 20 });
		const msg = msgs.find(mes => mes.embeds[0] && mes.embeds[0].type === 'rich' && mes.embeds[0].footer && mes.embeds[0].footer.text.split('| ')[1] === message.id);

		// Terminating if the message is not set in starboard, and deleting the message from starboard if star count goes low that threshold
		if (!msg) return null;
		const oldMsg = await channel.messages.fetch(msg.id);
		if (count < set.minimum) return await msg.delete();

		// Editing the embed if the message exists in starboard and threshold is still maintained.
		const embed = buildEmbed(message, count);
		return oldMsg.edit({ embed });
	}

}

module.exports = MessageReactionRemoveEvent;
