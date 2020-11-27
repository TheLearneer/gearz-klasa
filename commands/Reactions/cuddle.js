const Command = require('../../lib/Structures/CommandBase/Weeb');

class CuddleCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_PAT_DESCRIPTION'),
			usage: '<User:user>'
		});

		this.weeb = {
			type: 'cuddle',
			desciption: (author, user) => `${user} just got cuddled by ${author}`
		};
	}

}

module.exports = CuddleCommand;
