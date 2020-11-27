const Command = require('../../lib/Structures/CommandBase/Weeb');

class SlapCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_SLAP_DESCRIPTION'),
			usage: '<User:user>'
		});

		this.weeb = {
			type: 'slap',
			desciption: (author, user) => `${user} just got slapped by ${author}`
		};
	}

}

module.exports = SlapCommand;
