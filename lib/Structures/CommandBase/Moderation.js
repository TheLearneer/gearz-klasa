const { Command } = require('klasa');
const { verifyYesNo } = require('../../Util');

class ModerationBaseCommand extends Command {

	constructor(...args) {
		super(...args, { runIn: ['text'] });
	}

	async askConfirmation(msg) {
		msg.send('Are you sure, you want to perform this action ??\n`There is no reverse button on discord...`');
		const verification = await verifyYesNo(msg.channel, msg.author);
		if (verification === 0) throw 'Action terminated due to lack of confirmation response.';
		return verification;
	}

}

module.exports = ModerationBaseCommand;
