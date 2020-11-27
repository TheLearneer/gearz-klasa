/**
 * @file pirate-speak.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');
const { wordTranslate } = require('../../../lib/FunTranslate');
const { dictionary } = require('../../../assets/data/dictionaries/pirate');

class PirateSpeakCommand extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['pirate'],
			description: language => language.get('COMMAND_PIRATE_SPEAK_DESCRIPTION'),
			usage: '<Text:string>'
		});
	}

	async run(msg, [text]) {
		return msg.send(wordTranslate(text, dictionary));
	}

}

module.exports = PirateSpeakCommand;
