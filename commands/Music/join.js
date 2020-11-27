/**
 * @file join.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class JoinVCCommand extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			requiredPermissions: ['CONNECT', 'SPEAK'],
			desciption: language => language.get('COMMAND_MUSIC_JOIN_DESCRIPTION')
		});
	}

	async run(msg) {
		const { voiceChannel } = msg.member;
		if (!voiceChannel) throw 'You are not connected in a voice channel.';

		const { music } = msg.guild;
		await music.join(voiceChannel);

		return msg.send(`Successfully joined voice channel **${voiceChannel}**`);
	}

}

module.exports = JoinVCCommand;
