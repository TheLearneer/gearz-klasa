const Command = require('../../lib/Structures/CommandBase/Images');
const { MessageAttachment } = require('discord.js');

class MagikCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_MAGIK_DESCRIPTION'),
			usage: '[User:user|Image:image]'
		});
	}

	async run(message, [user = message.author]) {
		const img = this.getImage(user, { format: 'png', size: 1024 });
		const msg = await message.send('`Loading ...`');
		const { body } = await this.client.helper.Miscs.request('https://discord.services/api/magik')
			.query({ url: img });
		await msg.delete();
		message.channel.send(new MessageAttachment(body, 'magik.png'));
	}

}

module.exports = MagikCommand;
