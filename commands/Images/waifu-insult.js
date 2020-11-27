/**
 * @file waifu-insult.js (Command)
 * @author Santosh Bhandari
 * @license GPL-3.0
 */

const Command = require('../../lib/Structures/CommandBase/Images');
const { MessageAttachment } = require('discord.js');
const { Canvas } = require('canvas-constructor');
const fsn = require('fs-nextra');

class WaifuInsultCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_WAIFU_INSULT_DESCRIPTION'),
			usage: '[User:user|Image:image]',
			aliases: ['waifu_insult', 'waifu']
		});
	}

	async run(message, [user = message.author]) {
		const result = await this.waifuInsult(user);
		await message.channel.send(new MessageAttachment(result, 'waifu_insult.png'));
	}

	async waifuInsult(user) {
		const [plate, { body }] = await Promise.all([
			fsn.readFile('../../assets/images/waifu_insult.png'),
			this.client.helper.Miscs.request(this.getImage(user, { format: 'png', size: 256 }))
		]);

		const [width, height] = [450, 344];
		return new Canvas(width, height)
			.setColor('#FFFFFF')
			.addRect(0, 0, width, height)
			.rotate(15 * Math.PI / 180)
			.addImage(body, 155, 130, 170, 170)
			.rotate(-15 * Math.PI / 180)
			.addImage(plate, 0, 0, width, height)
			.toBuffer();
	}

}

module.exports = WaifuInsultCommand;
