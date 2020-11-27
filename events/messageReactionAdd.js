/**
 * @file messageReactionAdd.js (Event)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Event } = require('klasa');
const { buildEmbed } = require('../lib/Starboard');
const { addUser } = require('../lib/Giveaway');

class MessageReactionAddEvent extends Event {

	async run(reaction, user) {
		switch (reaction.emoji.name) {
			case '⭐':
				return await this.handleStarboard(reaction, user);
			// TO-BE-DONE add the giveaway :tada: emoji unicode
			case '':
				return await this.handleGiveaway(reaction, user);
			default:
				return null;
		}
	}

	async handleStarboard(reaction, user) {
		const { count, message } = reaction;

		const set = message.guild.settings.starboard;
		const channel = message.guild.channels.get(set.channel);

		// Exiting the starboard with some early checks
		if (!set.enabled) return null;
		if (!channel) return null;
		if (set.ignoreChannels.includes(message.channel.id)) return null;
		if (message.channel.nsfw && !channel.nsfw) return null;

		// Nop user's cant star their own message...
		if (message.author.id === user.id) {
			if (set.noSelfStar) message.send(message.language.get('STARBOARD_CANT_STAR_OWN', [user.tag])).then(msg => msg.delete({ timeout: 5000 }));
			return reaction.users.remove(user);
		}

		// Nop bot's cant star as well :P
		if (user.bot) return reaction.users.remove(user);

		// Star count in the message must be greater than the minium stars specified in the settings.
		if (count < set.minimum) return null;

		const embed = buildEmbed(message, count);

		// Editing the old starboard embed if exists, else send a new onerror
		const msgs = await channel.messages.fetch({ limit: 20 });
		const msg = msgs.find(mes => mes.embeds[0] && mes.embeds[0].type === 'rich' && mes.embeds[0].footer && mes.embeds[0].footer.text.split('| ')[1] === message.id);

		if (!msg) return channel.send({ embed });
		const _oldMsg = await channel.messages.fetch(msg.id);
		return _oldMsg.edit({ embed });
	}

	async handleGiveaway(reaction, user) {
		// Bot's aren't a valid candidate for giveaways ...
		if (user.bot) return;

		const { message } = reaction;
		const set = message.guild.settings.giveaways;

		// checking if the reacted message is a giveaway message
		if (!set.find(_set => _set._message === message.id)) return;

		await addUser(message, user);
	}

}

module.exports = MessageReactionAddEvent;
