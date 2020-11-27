const Command = require('../../lib/Structures/CommandBase/Weeb');

class BiteCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_BITE_DESCRIPTION'),
			usage: '<User:user>'
		});

		this.weeb = {
			type: 'bite',
			desciption: (author, user) => `${user} just got bitten by ${author}`
		};
	}

}

module.exports = BiteCommand;
