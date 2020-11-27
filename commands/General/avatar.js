/**
 * @file avatar.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class AvatarCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_AVATAR_DESCRIPTION'),
			usage: '[User:user]'
		});
	}

	async run(message, [user = message.author]) {
		const embed = this.client.helper.Miscs.getEmbed()
			.setImage(user.displayAvatarURL({ size: 1024 }));
		message.sendEmbed(embed);
	}

}

module.exports = AvatarCommand;
