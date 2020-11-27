/**
 * @file help.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command, util: { isFunction } } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['commands'],
			guarded: true,
			description: language => language.get('COMMAND_HELP_DESCRIPTION'),
			usage: '(Command:command)'
		});

		this.createCustomResolver('command', (arg, possible, message) => {
			if (!arg || arg === '') return undefined;
			return this.client.arguments.get('command').run(arg, possible, message);
		});
	}

	async run(msg, [cmnd]) {
		const embed = this.client.helper.Miscs.getEmbed({ footer: false });

		if (cmnd) {
			embed.setTitle(`${cmnd.name} command`)
				.setDescription([
					`📃 | _**Help Message**_ | __**${cmnd.name}**__`,
					isFunction(cmnd.description) ? cmnd.description(msg.language) : cmnd.description,
					``,
					'⌨ | _**Command Usage**_',
					`\`${msg.guildSettings.prefix}${cmnd.usage}\``,
					cmnd.aliases.length ? `\n📚 | _**Aliases**_\n${cmnd.aliases.map(cmd => `${cmd}`).join(', ')}\n` : ''
				].join('\n'));
			return msg.sendEmbed(embed);
		}

		const help = await this.buildHelp(msg);

		embed.setTitle(`${this.client.user.username}'s commands`)
			.setDescription(`Type \`${msg.guildSettings.prefix}help <commandName>\` for detailed information about a command.`);
		for (const cat of Object.keys(help)) {
			embed.addField(`❯❯ ${cat} [${help[cat].length}]`, help[cat].sort().map(cmd => `\`${cmd}\``).join(', '));
		}
		return msg.sendEmbed(embed);
	}

	async buildHelp(message) {
		const help = {};

		const filteredList = this.client.commands.filter(cmd => !cmd.hidden);

		await Promise.all(filteredList.map((command) =>
			this.client.inhibitors.run(message, command, true)
				.then(() => {
					if (!help.hasOwnProperty(command.category)) help[command.category] = [];
					help[command.category].push(command.name);
				})
				.catch(() => null)
		));
		return help;
	}

};
