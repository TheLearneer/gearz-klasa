/**
 * @file eyeify.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class ClapifyCommand extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_EYEIFY_DESCRIPTION'),
			usage: '<Text:str>'
		});
	}

	run(message, [inputText]) {
		return message.send(`👀 ${inputText.split(' ').join(' 👀 ')} 👀`);
	}

}

module.exports = ClapifyCommand;
