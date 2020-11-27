/**
 * @file yes-no.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class YesNoCommand extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			description: language => language.get('COMMAND_YESNO_DESCRIPTION')
		});
	}

	async run(msg) {
		const { answer, image } = this.client.helper.Miscs.Api.yesNo();
		return msg.send(`**${answer.toTitleCase()}**`, { files: [{ attachment: image, name: `I-say-${answer}.gif` }] })
			.catch(() => msg.sendLocale('FILE_TOO_LARGE'));
	}

}

module.exports = YesNoCommand;
