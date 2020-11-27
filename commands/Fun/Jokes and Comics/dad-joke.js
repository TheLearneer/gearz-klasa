/**
 * @file dad-joke.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class DadJokeCommand extends Command {

	constructor(...args) {
		super(...args, { description: language => language.get('COMMAND_DADJOKE_DESCRIPTION') });
	}

	async run(message) {
		const result = await this.client.helper.API.getDadJoke();
		return message.send(result.joke);
	}

}

module.exports = DadJokeCommand;
