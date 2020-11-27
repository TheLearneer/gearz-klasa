const Command = require('../../lib/Structures/CommandBase/Weeb');

class DanceCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_PAT_DESCRIPTION'),
			usage: '<User:user>'
		});

		this.weeb = {
			type: 'dance',
			desciption: (author) => `${author} boogies...`
		};
	}

}

module.exports = DanceCommand;
