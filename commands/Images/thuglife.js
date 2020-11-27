/**
 * @file thuglife.js (Command)
 * @author Santosh Bhandari
 * @license GPL-3.0
 */

const Command = require('../../lib/Structures/CommandBase/Images');
const { MessageAttachment } = require('discord.js');
const { Canvas } = require('canvas-constructor');
const fsn = require('fs-nextra');

class ThugLifeCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_THUGLIFE_DESCRIPTION'),
			usage: '[User:user|Image:image]',
			aliases: ['thug-life']
		});
	}

	async run(message, [user = message.author]) {
		const result = await this.thugLife(user);
		await message.channel.send(new MessageAttachment(result, 'bobRoss.png'));
	}

	async thugLife(user) {
		const [plate, { body }] = await Promise.all([
			fsn.readFile('../../assets/images/thug_life.png'),
			this.client.helper.Miscs.request(this.getImage(user, { format: 'png', size: 512 }))
		]);

		const [width, height] = [512, 512];
		return new Canvas(width, height)
			.setColor('#FFFFFF')
			.addRect(0, 0, width, height)
			.addImage(body, 0, 0, width, height)
			.addImage(plate, 0, 0, width, height)
			.toBuffer();
	}

}

module.exports = ThugLifeCommand;
