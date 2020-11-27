/**
 * @file guildMemberRemove.js (Event)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Event } = require('klasa');
const ImageGenerator = require('../lib/Images/Greeting');

class GuildMemberRemoveEvent extends Event {

	async run(member) {
		const { guild: { settings: { userLogs } } } = member;

		// user logging
		const logChannel = member.guild.channels.get(userLogs.channel);
		if (userLogs.leave.enabled && logChannel) {
			const text = userLogs.display.text ? this.formatMessage(userLogs.leave.message, member) : null;
			let image = null;
			if (userLogs.display.image) {
				const generator = new ImageGenerator();
				image = await generator.getImage(member, { id: userLogs.display.imageID, join: false });
			}
			await logChannel.send(text, image).catch(() => null);
		}
	}

	formatMessage(text, member) {
		return text
			.replace(/{user}/gi, member.user.uername)
			.replace(/{user:name}/gi, member.user.username)
			.replace(/{user:tag}/gi, member.user.tag)
			.replace(/{user:id}/gi, member.id)
			.replace(/{server}/gi, member.guild.name)
			.replace(/{server:members}/gi, member.guild.memberCount);
	}

}

module.exports = GuildMemberRemoveEvent;
