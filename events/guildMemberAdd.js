/**
 * @file guildMemberAdd.js (Event)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Event } = require('klasa');
const ImageGenerator = require('../lib/Images/Greeting');
const ModLog = require('../lib/ModLog');

class GuildMemberAddEvent extends Event {

	async run(member) {
		const { guild, guild: { settings: { autoMod, autoRole, userLogs } } } = member;

		// Nickname dehoisting
		if (autoMod.dehoisting.enabled) {
			const matched = member.user.username.match(/^[!@#$%^&*()`~=+[\]{};:",.<>?]/gi);
			if (matched) {
				await member.setNickname(autoMod.dehoisting.nickname);

				await new ModLog()
					.setAction('dehoist')
					.setUser(member.user)
					.setModerator('Automod')
					.setReason('[AUTO MODERATION] Dehoisted the user with name hoisting.')
					.send();
			}
		}

		// Providing autorole if it's enabled and there is atleast 1 role setup.
		if (autoRole.enabled && autoRole.roles.length) {
			for (const role of autoRole.roles) {
				const _role = guild.roles.get(role);
				if (_role) await member.roles.add(_role).catch(() => null);
			}
		}

		// user Logging
		const logChannel = guild.channels.get(userLogs.channel);
		if (userLogs.join.enabled && logChannel) {
			const text = userLogs.display.text ? this.formatMessage(userLogs.join.message, member) : null;
			let image = null;
			if (userLogs.display.image) {
				const generator = new ImageGenerator();
				image = await generator.getImage(member, { id: userLogs.display.imageID });
			}
			await logChannel.send(text, image).catch(() => null);
		}

		// DM message when a user joins the server, if it's enabled for that server
		if (userLogs.dm.enabled) {
			await member.send(this.formatMessage(userLogs.dm.message)).catch(() => null);
		}
	}

	formatMessage(text, member) {
		return text
			.replace(/{user}/gi, member.user)
			.replace(/{user:name}/gi, member.user.username)
			.replace(/{user:tag}/gi, member.user.tag)
			.replace(/{user:id}/gi, member.id)
			.replace(/{server}/gi, member.guild.name)
			.replace(/{server:members}/gi, member.guild.memberCount);
	}

}

module.exports = GuildMemberAddEvent;
