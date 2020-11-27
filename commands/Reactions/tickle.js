const Command = require('../../lib/Structures/CommandBase/Weeb');

class TickleCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_TICKLE_DESCRIPTION'),
			usage: '<User:user>'
		});

		this.weeb = {
			type: 'tickle',
			desciption: (author, user) => `${user} just got tickled by ${author}`
		};
	}

}

module.exports = TickleCommand;
