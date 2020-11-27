const Command = require('../../lib/Structures/CommandBase/Weeb');

class PatCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_PAT_DESCRIPTION'),
			usage: '<User:user>'
		});

		this.weeb = {
			type: 'pat',
			desciption: (author, user) => `${user} just got patted by ${author}`
		};
	}

}

module.exports = PatCommand;
