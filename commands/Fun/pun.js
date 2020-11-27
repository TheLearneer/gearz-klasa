/**
 * @file pun.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class PunCommand extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			descriptions: 'Get a random pun'
		});
	}

	async run(msg) {
		const result = await this.client.helper.Api.getPun();
		msg.send(result);
	}

}

module.exports = PunCommand;
