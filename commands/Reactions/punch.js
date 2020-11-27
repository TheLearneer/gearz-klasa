const Command = require('../../lib/Structures/CommandBase/Weeb');

class PunchCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_PUNCH_DESCRIPTION'),
			usage: '<User:user>'
		});

		this.weeb = {
			type: 'punch',
			desciption: (author, user) => `${user} just got punched by ${author}`
		};
	}

}

module.exports = PunchCommand;
