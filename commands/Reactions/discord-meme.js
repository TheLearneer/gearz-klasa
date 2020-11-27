const Command = require('../../lib/Structures/CommandBase/Weeb');

class DiscordMemeCommand extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			description: language => language.get('COMMAND_DISCORD_MEME_DESCRIPTION')
		});

		this.weeb = { type: 'discord_memes' };
	}

}

module.exports = DiscordMemeCommand;
