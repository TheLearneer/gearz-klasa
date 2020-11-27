const { Command } = require('klasa');
const inUse = new Map();

class IllegalCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_ILLEGAL_DESCRIPTION'),
			usage: '<Word:string>'
		});
	}

	async run(message, [word]) {
		if (inUse.get('true')) throw 'Trump is currently making something illegal, please wait.';
		const wordMatch = /^[a-zA-Z\s]{1,10}$/.exec(word);
		if (word.length < 1 || word.length > 10) {
			inUse.delete('true');
			throw 'Cannot be longer than 10 characters or shorter than 1 character.';
		}
		if (!wordMatch) {
			inUse.delete('true');
			throw 'Oops! Non-standard Unicode characters are now illegal.';
		}
		inUse.set('true', { user: message.author.id });
		try {
			message.send(`Convincing Trump that \`${word}\` should be illegal...`);
			message.channel.startTyping();
			await this.client.helper.Miscs.request('https://is-now-illegal.firebaseio.com/queue/tasks.json', 'post')
				.send({ task: 'gif', word: word.toUpperCase() });
			await this.sleep(5000);
			await message.sendEmbed(this.client.helper.Miscs.getEmbed({ footer: false })
				.setImage(`https://storage.googleapis.com/is-now-illegal.appspot.com/gifs/${word.split(' ').join('%20').toUpperCase()}.gif`));
			message.channel.stopTyping({ force: true });
			inUse.delete('true');
		} catch (error) {
			inUse.delete('true');
			message.channel.stopTyping({ force: true });
			throw error;
		}
	}

	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

}

module.exports = IllegalCommand;
