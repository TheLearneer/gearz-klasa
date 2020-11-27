/**
 * @file fancy-text.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');
const { dictionary } = require('../../../assets/data/dictionaries/fancytext');
const { letterTranslate } = require('../../../lib/FunTranslate');

class FancyTextCommand extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_FANCY_TEXT_DESCRIPTION'),
			usage: '<text:str>'
		});
		this.customizeResponse('text', 'Well blank spaces can\'t be fancy at all.');
	}

	async run(message, [str]) {
		return message.send(letterTranslate(str.toLowerCase(), dictionary));
	}

}

module.exports = FancyTextCommand;
