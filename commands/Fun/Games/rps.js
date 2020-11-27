/**
 * @file rps.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class RPSCommand extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_RPS_DESCRIPTION'),
			usage: '<rock|paper|scissor>'
		});
	}

	async run(msg, [choice]) {
		const botChoice = ['rock', 'paper', 'scissor'].random();
		const [drawText, userWinText, botWinText] = [
			msg.language.get('COMMAND_RPS_DRAW'),
			msg.language.get('COMMAND_RPS_USER_WIN'),
			msg.language.get('COMMAND_RPS_BOT_WIN')
		];

		let result = botWinText;

		if (botChoice === choice) result = drawText;
		else if (botChoice === 'rock' && choice === 'paper') result = userWinText;
		else if (botChoice === 'paper' && choice === 'scissor') result = userWinText;
		else if (botChoice === 'scissor' && choice === 'rock') result = userWinText;

		const output = `**${msg.author.username}**: ${choice}\t\t__VS__\t\t**${this.client.user.username}**: ${botChoice}\n${result}`
			.replace(/rock/gi, ':fist::skin-tone-2:').replace(/paper/gi, ':newspaper:').replace(/scissor/gi, ':scissors: ');
		return await msg.send(output);
	}

}

module.exports = RPSCommand;
