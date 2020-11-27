/**
 * @file upside-down.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');
const { dictionary } = require('../../../assets/data/dictionaries/updown');
const { letterTranslate } = require('../../../lib/FunTranslate');

class UpsideDownCommand extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_UPSIDE_DOWN_DESCRIPTION'),
			usage: '<text:str>',
			aliases: ['up-down', 'updown']
		});
		this.customizeResponse('text', 'Space are already the same up and down. Better provide some texts for better result.');
	}

	async run(message, [str]) {
		return message.send(letterTranslate(str, dictionary));
	}

}

module.exports = UpsideDownCommand;
