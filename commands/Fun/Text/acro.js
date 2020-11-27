/**
 * @file acro.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class AcroCommand extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_ACRO_DESCRIPTION'),
			usage: '<Words:str>'
		});
		this.customizeResponse('Words', 'You must Provide some text to have a look at it\'s acro.');
	}

	async run(msg, [_text]) {
		_text = _text.split(' ');
		const _left = _text.map(txt => txt[0].toTitleCase()).join('');
		const _right = _text.map(txt => `**${txt.slice(0, 1).toTitleCase()}**${txt.slice(1, txt.length)}`).join(' ');
		msg.send(`**${_left}** = ${_right}`);
	}

}

module.exports = AcroCommand;
