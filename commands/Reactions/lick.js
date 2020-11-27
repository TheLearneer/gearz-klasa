const Command = require('../../lib/Structures/CommandBase/Weeb');

class LickCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_TICKLE_DESCRIPTION'),
			usage: '<User:user>'
		});

		this.weeb = {
			type: 'lick',
			desciption: (author, user) => `${user} just got licked by ${author}`
		};
	}

}

module.exports = LickCommand;
