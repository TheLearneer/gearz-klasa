const { Inhibitor } = require('klasa');

class RequireMusicInhibitor extends Inhibitor {


	async run(msg, cmd) {
		if (cmd.requireMusic !== true) return;
		if (!msg.member.voiceChannel) throw 'You are not connected in a voice channel.';
		if (!msg.guild.me.voiceChannel) throw 'I am not connected in a voice channel.';
		if (msg.member.voiceChannel !== msg.guild.me.voiceChannel) throw 'You must be in the same voice channel as me.';
	}

}

module.exports = RequireMusicInhibitor;
