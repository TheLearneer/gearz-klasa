/**
 * @file zalgolize.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class ZalgolizeCommand extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_ZALGOLIZE_DESCRIPTION'),
			usage: '<Text:string>'
		});
	}

	run(msg, [text]) {
		return msg.send(this.zalgolize(text));
	}

	zalgolize(string) {
		let res = '';
		for (let i = 0; i < string.length; i += 1) {
			res += string[i];
			for (let j = 0; j < Math.floor(Math.random() * (this.souls.length + 1)); j += 1) {
				res += this.souls.random().random();
			}
		}
		return res;
	}

	get souls() {
		return [
			// Highs
			[
				'̍', '̎', '̄', '̅', '̿', '̑', '̆', '̐', '͒', '͗', '͑', '̇', '̈', '̊', '͂', '̓', '̈', '͊', '͋', '͌', '̃', '̂', '̌', '͐', '̀',
				'́', '̋', '̏', '̒', '̓', '̔', '̽', '̉', 'ͣ', 'ͤ', 'ͥ', 'ͦ', 'ͧ', 'ͨ', 'ͩ', 'ͪ', 'ͫ', 'ͬ', 'ͭ', 'ͮ', 'ͯ', '̾', '͛', '͆', '̚'
			],
			// Mids
			[
				'̕', '̛', '̀', '́', '͘', '̡', '̢', '̧', '̨', '̴', '̵', '̶', '͜', '͝', '͞', '͟', '͠', '͢', '̸', '̷', '͡', '҉'
			],
			// Lows
			[
				'̖', '̗', '̘', '̙', '̜', '̝', '̞', '̟', '̠', '̤', '̥', '̦', '̩', '̪', '̫', '̬', '̭', '̮', '̯', '̰',
				'̱', '̲', '̳', '̹', '̺', '̻', '̼', 'ͅ', '͇', '͈', '͉', '͍', '͎', '͓', '͔', '͕', '͖', '͙', '͚', '̣'
			]
		];
	}

}

module.exports = ZalgolizeCommand;
