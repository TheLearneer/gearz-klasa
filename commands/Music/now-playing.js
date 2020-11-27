const { Command } = require('klasa');
const { getVideoByID } = require('../../lib/google/YoutubeAPI');
const { getDuration } = require('../../lib/Util');

class NowPlayingCommand extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: language => language.get('COMMAND_MUSIC_NOW_PLAYING_DESCRIPTION')
		});
		this.requireMusic = true;
	}

	async run(msg) {
		const { music } = msg.guild;
		if (music.queue.length < 1) return msg.sendLocale('MUSIC_QUEUE_EMPTY');
		const songInfo = await getVideoByID(music.queue[0].id);

		const embed = this.client.helper.Miscs.getEmbed({ footer: false })
			.setColor(12916736)
			.setThumbnail(songInfo.thumbnail)
			.setDescription([
				`**Duration**: ${getDuration(songInfo.length * 1000)}`,
				`**Time Remaining**: ${getDuration((parseInt(songInfo.length) * 1000) - music.dispatcher.streamTime)}`,
				'',
				`**Description**: ${songInfo.description.shorten(500)}`
			].join('\n'));
		return msg.send(embed);
	}

}

module.exports = NowPlayingCommand;
