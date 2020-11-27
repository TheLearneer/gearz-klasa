/**
 * @file rainbow.js (Command)
 * @author Santosh Bhandari
 * @license GPL-3.0
 */

const Command = require('../../lib/Structures/CommandBase/Images');
const { MessageAttachment } = require('discord.js');
const { Canvas } = require('canvas-constructor');
const fsn = require('fs-nextra');

class RainbowCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_RAINBOW_DESCRIPTION'),
			usage: '[User:user|Image:image]'
		});
	}

	async run(message, [user = message.author]) {
		const result = await this.isColorful(user);
		await message.channel.send(new MessageAttachment(result, 'rainbow.png'));
	}

	async isColorful(user) {
		const [plate, { body }] = await Promise.all([
			fsn.readFile('../../assets/images/image_rainbow.png'),
			this.client.helper.Miscs.request(this.getImage(user, { format: 'png', size: 2048 }))
		]);
		return new Canvas(2048, 2048)
			.addImage(body, 0, 0, 2048, 2048)
			.addImage(plate, 0, 0, 2048, 2048)
			.toBuffer();
	}

}

module.exports = RainbowCommand;
