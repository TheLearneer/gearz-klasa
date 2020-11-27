const { Command } = require('klasa');

// NOT sure if Want to do this command....
class TeenPattiCommand extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: '',
			enabled: false
		});
		this.hidden = true;
	}

	async run(msg) { // eslint-disable-line no-unused-vars
		return true;
		// await this.awaitMembers(msg);
	}

	async awaitMembers(msg) {
		msg.send([
			`${msg.member.displayName}, you have successfully joined the lobby. Need 1 more play to start the game.`,
			'Ask them to type `join` to join the lobby.',
			'',
			'NOTE: `A lobby can have 2-5 players.`'
		].join('\n'));

		const filter = res => !res.user.bot && res.content.toLowerCase() === 'join';
		const joined = await msg.channel.awaitMessages(filter, { time: 30000, max: 5 });

		if (joined.size < 1) throw 'Can\'t start the game with less than 2 players in the lobby.';
	}

}

module.exports = TeenPattiCommand;
