/**
 * @file badge.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class BadgeCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_BADGE_DESCRIPTION'),
			usage: '<Color:string> <Status:string> <subject:string> [...]',
			usageDelim: ' ',
			subcommands: true
		});
	}

	async run(msg, [color, status, ...subject]) { // eslint-disable-line no-unused-vars
		// TO-BE-DONE
	}

}

module.exports = BadgeCommand;
