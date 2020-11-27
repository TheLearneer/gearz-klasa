const { MessageEmbed } = require('discord.js');

class ModLog {

	constructor(guild) {
		this.guild = guild;
		this.client = guild.client;

		this.action = null;
		this.case = null;
		this.reason = null;

		this.user = null;
		this.moderator = null;
	}

	setAction(type) {
		this.action = type;
		return this;
	}

	setUser(user) {
		this.user = {
			id: user.id,
			tag: user.tag
		};
		return this;
	}

	setModerator(user) {
		this.moderator = {
			tag: typeof user === 'string' ? user : user.tag,
			avatar: typeof user === 'string' ? this.client.user.displayAvatarURL({ size: 64 }) : user.displayAvatarURL({ size: 64 })
		};
		return this;
	}

	setReason(reason = null) {
		if (reason instanceof Array) reason = reason.join(' ');
		this.reason = reason;
		return this;
	}

	async send() {
		if (!this.guild.settings.moderation.logs) return;
		let logChannel = this.guild.settings.moderation.channel;
		if (logChannel) logChannel = this.guild.channels.get(logChannel);
		if (!logChannel) throw this.guild.languge.get('MODLOG_CHANNEL_NOT_FOUND');
		this.case = await this.getCase();
		logChannel.send({ embed: this.embed });
	}

	get embed() {
		const embed = new MessageEmbed()
			.setAuthor(this.moderator.tag, this.moderator.avatar)
			.setColor(ModLog.colour(this.action))
			.setDescription([
				`**User**: ${this.user.tag} (${this.user.id})`,
				`**Action**: ${this.action}`,
				`**Reason**: ${this.reason || this.guild.language.get('MODLOG_NOT_CLAIMED', [this.guild.settings.prefix, this.case])}`
			])
			.setFooter(`Case ${this.case}`)
			.setTimestamp();
		return embed;
	}

	async getCase() {
		const channel = this.guild.channels.get(this.guild.settings.moderation.channel);
		const msgs = await channel.messages.fetch({ limit: 10 });
		const log = msgs.filter(msg => msg.author.id === this.client.user.id && msg.embeds[0] && msg.embeds[0].type === 'rich' &&
			msg.embeds[0].footer && msg.embeds[0].footer.text.startsWith('Case')).first();
		if (!log) return 1;
		const thisCase = /Case\s(\d+)/.exec(log.embeds[0].footer.text);
		return thisCase ? parseInt(thisCase[1]) + 1 : 1;
	}

	static colour(type) {
		// TO-BE-DONE add proper colors to all the moderation types.
		switch (type.toLowerCase()) {
			case 'ban': return 16724253;
			case 'unban': return 1822618;
			case 'warn': return 16564545;
			case 'kick': return 16573465;
			case 'softban': return 15014476;
			case 'dehoist': return 1;
			case 'mute': return 1;
			case 'unmute': return 1;
			default: return 16777215;
		}
	}

}

module.exports = ModLog;
