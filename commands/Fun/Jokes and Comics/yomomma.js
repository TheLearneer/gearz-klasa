/**
 * @file yomomma.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class YomommaCommand extends Command {

	constructor(...args) {
		super(...args, { description: language => language.get('COMMAND_YOMOMMA_DESCRIPTION') });
	}

	async run(message) {
		const result = await this.client.helper.API.yomomma();
		return message.send(result);
	}

}

module.exports = YomommaCommand;
