/**
 * @file trump-quote.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class TrumpQuoteCommand extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_TRUMP_QUOTE_DESCRIPTION'),
			usage: '[User:user|Name:str]',
			aliases: ['thrumpthink']
		});
	}

	async run(message, [user = message.author]) {
		user = typeof user === 'string' ? user : user.username;
		const result = await this.client.helper.API.getTrumpQuote(user);

		message.send(result.message.replace(user, `**_${user}_**`).replace(result.nickname, `_${result.nickname}_`));
	}

}

module.exports = TrumpQuoteCommand;
