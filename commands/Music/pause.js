/**
 * @file pause.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class PauseMusicCommand extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			desciption: language => language.get('COMMAND_MUSIC_PAUSE_DESCRIPTION')
		});
		this.requireMusic = true;
	}

	async run(msg) {
		const { music } = msg.guild;
		await music.pause();

		return msg.send('Paused the music');
	}

}

module.exports = PauseMusicCommand;
