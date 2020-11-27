/**
 * @file this-for-that.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class ThisForThatCommand extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			descriptions: 'This is for that'
		});
	}

	async run(msg) {
		const result = await this.client.helper.Api.thisForThat();
		msg.send(result);
	}

}

module.exports = ThisForThatCommand;
