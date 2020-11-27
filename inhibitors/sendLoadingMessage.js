const { Inhibitor } = require('klasa');

class SendLoadingMessageInhibitor extends Inhibitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			spamProtection: false
		});
	}

	async run(message, cmd) {
		if (!cmd.loadingString) return;

		// sending the loading message and add the property to the message so that it can be easily delete later.
		const msg = await message.send(cmd.loadingString);
		message.loader = msg;
	}

}

module.exports = SendLoadingMessageInhibitor;
