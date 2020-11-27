const { Command, version: klasaVersion, Duration } = require('klasa');
const { version: discordVersion } = require('discord.js');

class StatsCommand extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: language => language.get('COMMAND_STATS_DESCRIPTION')
		});
	}

	async run(message) {
		let [users, guilds, memory] = [0, 0, 0];

		const results = await this.client.shard.broadcastEval(`[this.users.size, this.guilds.size, (process.memoryUsage().heapUsed / 1024 / 1024)]`);
		for (const result of results) {
			users += result[0];
			guilds += result[1];
			memory += result[2];
		}

		const embed = this.client.helper.Miscs.getEmbed()
			.setTitle(`${this.client.user.username}'s Stats`)
			.setThumbnail(this.client.user.displayAvatarURL())
			.addField('❯❯ General', `• Servers: **${guilds.toLocaleString()}**\n• Users: **${users.toLocaleString()}**`, true)
			.addField('❯❯ Stats', `• Memory: **${memory.toFixed(2)} MB**\n• Uptime: **${Duration.toNow(Date.now() - (process.uptime() * 1000))}**`, true)
			.addField('❯❯ Info', `• Discord.js: **${discordVersion}**\n• Node.js: **${process.version}**\n• Klasa: **${klasaVersion}**`);
		return message.sendEmbed(embed);
	}

}

module.exports = StatsCommand;
