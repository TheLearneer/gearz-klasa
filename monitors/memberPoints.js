const { Monitor } = require('klasa');
const { Collection } = require('discord.js');
const { randomInt } = require('../lib/Util');
const { getLevelFromXP } = require('../lib/Economy');

class MemberPoints extends Monitor {

	constructor(...args) {
		super(...args, { ignoreOthers: false });
		this.pointsCooldown = new Collection();
	}

	async run(msg) {
		// Basic checks either to provide or not to provide the points.
		if (!msg.guild) return;
		if (msg.command) return;
		if (this.pointsCooldown.has(`${msg.guild.id}.${msg.author.id}`)) return;

		// Looking if the guild member object is present for the current message author
		if (!msg.member) await msg.guild.members.fetch(msg.author.id);

		// Guild specific check either to provide or not to provide the points.
		const { settings: { economy } } = msg.guild;
		if (!economy.enabled) return;
		if (economy.ignoreChannels.includes(msg.channel.id)) return;
		for (const role of economy.roles) if (msg.member.roles.get(role)) return;

		// Current XP and Level of the member
		const { settings: { level, xp } } = msg.member;
		const updateEntry = [];

		// Well the member is all clean so the member can get x amount of points per y minutes, congrats member :P
		this.pointsCooldown.set(`${msg.guild.id}.${msg.author.id}`);

		// Giving some random points to the member
		const points = xp + randomInt(5, 20);

		// Getting the member's level after the added xp.
		const newLevel = getLevelFromXP(points);

		// Checking if the level is increased and if level notice is enabled in the guild, if enabled sending the level notice.
		if (newLevel > level && economy.levelNotice.enabled) {
			msg.send(this.formatMessage(economy.levelNotice.message, msg.member, newLevel)).catch(() => null);

			// the new level should be updated in the member's setting as well, so making it ready to be updated.
			updateEntry.push('level', newLevel);
		}

		// making the xp ready to be updated
		updateEntry.push('xp', points);
		await msg.member.settings.update(updateEntry);

		// Removing the member from the cooldown, which means the member can get more points again :woohoo:
		setTimeout(() => {
			this.pointsCooldown.delete(`${msg.guild.id}.${msg.author.id}`);
		}, 2000);
	}

	formatMessage(msg, member, level) {
		return msg
			.replace(/{member}/gi, member)
			.replace(/{member:name}/gi, member.displayName)
			.replace(/{level}/gi, level);
	}

}

module.exports = MemberPoints;
