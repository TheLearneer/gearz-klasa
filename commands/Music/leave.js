/**
 * @file leave.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class LeaveVCCommand extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			requiredPermissions: [],
			desciption: language => language.get('COMMAND_MUSIC_LEAVE_DESCRIPTION')
		});
		this.requireMusic = true;
	}

	async run(msg) {
		const { music } = msg.guild;
		await music.leave();

		return msg.send(`Left the voice Channel **${msg.guild.me.voiceChannel}**`);
	}

}

module.exports = LeaveVCCommand;
