const { WebhookClient } = require('discord.js');
const { keys: { webhooks: { guildLogger, dblUpvoteLogger } } } = require('../config');
const { emotes } = require('./Structures/emotes');

class WebhookLogger {

	constructor(client) {
		this.client = client;

		this.guildLogger = new WebhookClient(guildLogger.id, guildLogger.token);
		this.dblUpvoteLogger = new WebhookClient(dblUpvoteLogger.id, dblUpvoteLogger.token);
	}

	async logGuildChange(guild, join = true) {
		if (this.client.user.id !== '367202192609902593' || !this.client.config.loggingOptions.guildLogger) return;

		let guilds = await this.client.shard.broadcastEval(`this.guilds.size`);
		guilds = guilds.reduce((prev, val) => prev + val, 0);

		const what = join ? `${emotes.tick} **Guild Join**` : `${emotes.cross} **Guild leave**`;
		const msg = [
			`${what} \`${guild.name}\` (\`${guild.id}\`)`,
			'',
			`\`-\` Member Count: **${guild.memberCount}**`,
			`\`-\` Humans: **${guild.members.filter(mem => !mem.user.bot).size}** (\`May not be exactly correct.\`)`,
			`\`-\` Bots: **${guild.members.filter(mem => mem.user.bot).size}** (\`May not be exactly correct.\`)`,
			`\`-\` Owner: **${guild.owner ? guild.owner.user.tag : 'Owner is not fetched...'}** (\`${guild.ownerID}\`)`,
			'',
			'_ _'
		].join('\n');

		const embed = this.client.helper.Miscs.getEmbed({ text: `I am now in ${guilds} guilds.` })
			.setThumbnail(guild.iconURL())
			.setDescription(msg)
			.setTimestamp();

		this.guildLogger.send(embed);
	}

	async logDblUpvote(user, providedRole, platform) {
		if (this.client.user.id !== '367202192609902593' || !this.client.config.loggingOptions.dblUpvoteLogger) return;

		const embed = this.client.helper.Miscs.getEmbed({ footer: false })
			.setTitle(`Someone upvoted for ${this.client.user.username} on ${platform}.`)
			.setDescription([
				`User: ${user.tag} (\`${user.id}\`)`,
				'',
				providedRole ? `Provided the Upvoter role...` : ''
			].join('\n'))
			.setTimestamp();

		this.dblUpvoteLogger.send(embed);
	}

}

module.exports = WebhookLogger;
