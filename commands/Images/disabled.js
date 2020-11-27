/**
 * @file disabled.js (Command)
 * @author Santosh Bhandari
 * @license GPL-3.0
 */

const Command = require('../../lib/Structures/CommandBase/Images');
const { MessageAttachment } = require('discord.js');
const { Canvas } = require('canvas-constructor');
const fsn = require('fs-nextra');

class DisabledCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_DISABLED_DESCRIPTION'),
			usage: '[User:user|Image:image]'
		});
	}

	async run(message, [user = message.author]) {
		const result = await this.disabledit(user);
		await message.channel.send(new MessageAttachment(result, 'disabled.png'));
	}

	async disabledit(user) {
		const [plate, { body: usrAvatar }] = await Promise.all([
			fsn.readFile('../../assets/images/disabled.png'),
			this.client.helper.Miscs.request(this.getImage(user))
		]);

		return new Canvas(564, 527)
			.setColor('#000000')
			.addRect(0, 0, 564, 527)
			.addImage(plate, 0, 0, 564, 527)
			.addImage(usrAvatar, 380, 220, 175, 175)
			.toBuffer();
	}

}

module.exports = DisabledCommand;
