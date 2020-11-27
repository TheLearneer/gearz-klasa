const { Monitor } = require('klasa');

class AFKMonitor extends Monitor {

	constructor(...args) {
		super(...args, {
			ignoreOthers: false,
			ignoreEdits: false
		});
	}

	async run(msg) {
		const { users } = msg.mentions;
		let breaksAFK = false;
		const afkMessages = [];

		// Checking the AFK status for all mentioned users.
		for (const user of users) {
			const { settings: { afk } } = user;
			// If the mentioned user is not bot, and if the user has afk enabled then processing the user's AFK status.
			if (!user.bot && afk.enabled) {
				if (breaksAFK === false) breaksAFK = true;
				// adding mentioned user's AFK message to the no-afk reply message
				afkMessages.push(msg.language.get('AFK_USER_IS_AFK', [`**\`${user.tag}\`**`, afk.message]));
			}
		}

		if (breaksAFK) msg.send(afkMessages.join('\n\n'));
	}


}

module.exports = AFKMonitor;
