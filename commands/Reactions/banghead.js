const Command = require('../../lib/Structures/CommandBase/Weeb');

class BangheadCommand extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			desciption: language => language.get('COMMAND_BANGHEAD_DESCRIPTION')
		});

		this.weeb = { type: 'banghead' };
	}

}

module.exports = BangheadCommand;
