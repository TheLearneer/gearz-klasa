/**
 * @file cursive.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');
const { dictionary } = require('../../../assets/data/dictionaries/cursive');
const { letterTranslate } = require('../../../lib/FunTranslate');

class CursiveCommand extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_CURSIVE_DESCRIPTION'),
			usage: '<text:str>'
		});
		this.customizeResponse('text', "Well blank spaces can't be cursified at all.");
	}

	async run(message, [str]) {
		return message.send(letterTranslate(str, dictionary));
	}

}

module.exports = CursiveCommand;
