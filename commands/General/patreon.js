/**
 * @file patreon.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class PatreonCommand extends Command {

	constructor(...args) {
		super(...args, { desciption: language => language.get('COMMAND_PATREON_DESCRIPTION') });
	}

	async run(msg) {
		/* eslint-disable */
		const embed = this.client.helper.Miscs.getEmbed()
			.setColor(0xff5900)
			.setAuthor(this.client.user.tag, this.client.user.displayAvatarURL(), 'https://www.patreon.com/Froosty')
			.setDescription('Patrons(any tier) have additional access and features to the bots, like patron only command, less cooldown amount on commands and few more things which is sure to be expanded in the future. All you got to do is support the developers for the creation and hosting of the bot itself by donating a small amount of money.')
			.addField('Become a Patron', 'The cheapest support and special role in the official server of the bot and love.\n**Click** [here](https://www.patreon.com/bePatron?c=110057&rid=2004589) **to pledge $1.00**\n')
			.addField('Supporter', `A better support for developement of **${this.client.user.username}** bot with a special role in the server and lots of love.\n**Click** [here](https://www.patreon.com/bePatron?c=110057&rid=2004573) **to pledge $5.00**\n`);
		msg.sendEmbed(embed);
	}

}

module.exports = PatreonCommand;
