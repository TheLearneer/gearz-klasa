/**
 * @file choose.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class ChooseCommand extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_CHOOSE_DESCRIPTION'),
			usage: '<Choices:String> [...]',
			usageDelim: ','
		});
	}

	async run(msg, choices) {
		return msg.sendLocale(choices.length < 2 ?
			'COMMAND_CHOOSE_NOT_ENOUGH' :
			'COMMAND_CHOOSE_PREFER', [`\`${choices.random()}\``]);
	}

}

module.exports = ChooseCommand;
