const Command = require('../../lib/Structures/CommandBase/Weeb');

class PokeCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_POKE_DESCRIPTION'),
			usage: '<User:user>'
		});

		this.weeb = {
			type: 'poke',
			desciption: (author, user) => `${user} just got poked by ${author}`
		};
	}

}

module.exports = PokeCommand;
