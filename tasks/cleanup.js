const { Task, Colors } = require('klasa');
const { util: { binaryToID } } = require('discord.js');

const THRESHOLD = 1000 * 60 * 30,
	EPOCH = 1420070400000,
	EMPTY = '0000100000000000000000';

class MemorySweeperTask extends Task {

	constructor(...args) {
		super(...args, { enabled: false });

		// The colors to stylise the console's logs
		this.colors = {
			red: new Colors({ text: 'lightred' }),
			yellow: new Colors({ text: 'lightyellow' }),
			green: new Colors({ text: 'green' })
		};

		// The header with the console colors
		this.header = new Colors({ text: 'lightblue' }).format('[CACHE CLEANUP]');
	}

	async run() {
		const OLD_SNOWFLAKE = binaryToID(((Date.now() - THRESHOLD) - EPOCH).toString(2).padStart(42, '0') + EMPTY);
		let presences = 0, guildMembers = 0, emojis = 0, lastMessages = 0, users = 0;

		// Per-Guild sweeper
		for (const guild of this.client.guilds.values()) {
			// Clear presences
			presences += guild.presences.size;
			guild.presences.clear();

			// Clear members that haven't send a message in the last 30 minutes
			const { me } = guild;
			for (const [id, member] of guild.members) {
				if (member === me) continue;
				if (member.voiceChannelID) continue;
				if (member.lastMessageID && member.lastMessageID > OLD_SNOWFLAKE) continue;
				guildMembers++;
				guild.members.delete(id);
			}

			// Clear emojis
			emojis += guild.emojis.size;
			guild.emojis.clear();
		}

		// Per-Channel sweeper
		for (const channel of this.client.channels.values()) {
			if (channel.lastMessageID) {
				channel.lastMessageID = null;
				lastMessages++;
			}
		}

		// Per-User sweeper
		for (const user of this.client.users.values()) {
			if (user.lastMessageID && user.lastMessageID > OLD_SNOWFLAKE) continue;
			this.client.users.delete(user.id);
			this.client.gateways.users.cache.delete(user.id);
			users++;
		}

		// Emit a log
		this.client.emit('verbose', [
			this.header,
			`${this.setColor(presences)} [Presence]s | `,
			`${this.setColor(guildMembers)} [GuildMember]s | `,
			`${this.setColor(users)} [User]s | `,
			`${this.setColor(emojis)} [Emoji]s | `,
			`${this.setColor(lastMessages)} [Last Message]s.`
		].join(' '));
	}

	setColor(number) {
		const text = String(number).padStart(5, ' ');
		if (number > 1000) return this.colors.red.format(text);
		if (number > 100) return this.colors.yellow.format(text);
		return this.colors.green.format(text);
	}

}

module.exports = MemorySweeperTask;
