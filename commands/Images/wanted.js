/**
 * @file wanted.js (Command)
 * @author Santosh Bhandari
 * @license GPL-3.0
 */

const Command = require('../../lib/Structures/CommandBase/Images');
const { MessageAttachment } = require('discord.js');
const { Canvas, sepia } = require('canvas-constructor');
const fsn = require('fs-nextra');

class WantedCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_WANTED_DESCRIPTION'),
			usage: '[User:user|Image:image]'
		});
	}

	async run(message, [user = message.author]) {
		const result = await this.isWanted(user);
		await message.channel.send(new MessageAttachment(result, 'wanted.png'));
	}

	async isWanted(user) {
		const [plate, { body }] = await Promise.all([
			fsn.readFile('../../assets/images/plate_wanted.png'),
			this.client.helper.Miscs.request(this.getImage(user))
		]);
		return new Canvas(360, 640)
			.setColor('#debb80')
			.addRect(0, 0, 360, 640)
			.addImage(body, 30, 200, 300, 300)
			.process(sepia)
			.addImage(plate, 0, 0, 360, 640)
			.toBuffer();
	}

}

module.exports = WantedCommand;
