const Command = require('../../lib/Structures/CommandBase/Weeb');

class CryCommand extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			desciption: 'This command needs description...'
		});

		this.weeb = { type: 'cry' };
	}

}

module.exports = CryCommand;
