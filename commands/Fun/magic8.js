/**
 * @file magic8.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class Magic8Command extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['8ball'],
			description: language => language.get('COMMAND_MAGIC8_DESCRIPTION')
			// usage: '',
		});
	}

	async run(msg) {
		const answers = msg.language.get('COMMAND_MAGIC8_RESPONSES');

		msg.send(`${this.client.user.uesrname} is thinking ...`);
		setTimeout(() => msg.send(`${answers.random()}`), (Math.random() * (1 - 5)) + (1 * 2000));
	}

}

module.exports = Magic8Command;
