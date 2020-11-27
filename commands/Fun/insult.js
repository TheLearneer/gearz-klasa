/**
 * @file insult.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class InsultCommand extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_INSULT_DESCRIPTION'),
			usage: '[User:member|Name:string]'
		});
	}

	async run(msg, [member = msg.member]) {
		member = typeof member === 'string' ? member : member.displayName;
		const result = await this.client.helper.API.insult();
		msg.send(`**${member}**, _${result}_.`);
	}

}

module.exports = InsultCommand;
