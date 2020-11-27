const Command = require('../../lib/Structures/CommandBase/Weeb');

class HugCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_TICKLE_DESCRIPTION'),
			usage: '<User:user>'
		});

		this.weeb = {
			type: 'hug',
			desciption: (author, user) => `${user} just got hugged by ${author}`
		};
	}

}

module.exports = HugCommand;
