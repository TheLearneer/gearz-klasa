/**
 * @file resume.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class ResumeMusicCommand extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			desciption: language => language.get('COMMAND_MUSIC_RESUME_DESCRIPTION')
		});
		this.requireMusic = true;
	}

	async run(msg) {
		const { music } = msg.guild;
		await music.resume();

		return msg.send('Resumed music');
	}

}

module.exports = ResumeMusicCommand;
