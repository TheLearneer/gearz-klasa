const Command = require('../../lib/Structures/CommandBase/Weeb');

class KissCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_TICKLE_DESCRIPTION'),
			usage: '<User:user>'
		});

		this.weeb = {
			type: 'kiss',
			desciption: (author, user) => `${user} just got kissed by ${author}`
		};
	}

}

module.exports = KissCommand;
