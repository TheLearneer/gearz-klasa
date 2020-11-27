/**
 * @file tiny-text.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');
const { dictionary: dictTiny } = require('../../../assets/data/dictionaries/tinytext');
const { dictionary: dictSuper } = require('../../../assets/data/dictionaries/superScript');
const { dictionary: dictSub } = require('../../../assets/data/dictionaries/subScript');
const { letterTranslate } = require('../../../lib/FunTranslate');

class TinyTextCommand extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_TINY_TEXT_DESCRIPTION'),
			usage: '[super|tiny] <text:str>'
		});
	}

	async run(msg, [dict = 'tiny', text]) {
		dict = this.getDictionary(dict);
		return await msg.send(letterTranslate(text, dict));
	}

	getDictionary(dict) {
		if (dict === 'tiny') return dictTiny;
		else if (dict === 'super') return dictSuper;
		else return dictSub;
	}

}

module.exports = TinyTextCommand;

/*
class TinyTextCommand extends Command {

	constructor(...args) {
		super(...args, {
			subcommands: true,
			description: language => language.get('COMMAND_TINY_TEXT_DESCRIPTION'),
			usage: '[super|tiny:default] <text:str> [...]',
			usageDelim: ' '
		});
	}

	sub(msg, [...str]) {
		return this.processCmd(msg, _dictSub, str.join(' '));
	}

	super(msg, [...str]) {
		return this.processCmd(msg, _dictSuper, str.join(' '));
	}

	tiny(msg, [...str]) {
		return this.processCmd(msg, _dictTiny, str.join(' ').toLowerCase());
	}

	processCmd(msg, dict, str) {
		return msg.send(letterTranslate(str, dict));
	}

}
*/
