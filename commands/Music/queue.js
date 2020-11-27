const { Command } = require('klasa');
const { getDuration } = require('../../lib/Util');

class QueueCommand extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: 'Have a look at all the music in the queue.'
		});
	}

	async run(msg) {
		const { queue } = msg.guild.music;
		if (queue.length < 1) return msg.send('There is no music in the queue');

		const queueList = [];
		for (let i = 0; i < Math.min(queue.length, 10); i++) {
			const song = queue[i];
			queueList.push([
				`[__\`${String(i + 1).padStart(2, 0)}\`__] *${song.title.replace(/\*/g, '\\*')}* request by **${song.requester.tag || song.requester}**`,
				`   └── <${song.url}> (${getDuration(song.duration * 1000)})`
			].join('\n'));
		}

		if (queue.length > 10) queueList.push('', `Showing 10 songs of ${queue.length}`);

		return msg.send(queueList.join('\n'));
	}

}

module.exports = QueueCommand;
