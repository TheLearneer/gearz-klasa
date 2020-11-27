const Command = require('../../lib/Structures/CommandBase/Weeb');

class BlushCommand extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			desciption: 'This command needs description...'
		});

		this.weeb = { type: 'blush' };
	}

}

module.exports = BlushCommand;
