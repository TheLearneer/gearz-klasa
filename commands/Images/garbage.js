/**
 * @file garbage.js (Command)
 * @author Santosh Bhandari
 * @license GPL-3.0
 */

const Command = require('../../lib/Structures/CommandBase/Images');
const { MessageAttachment } = require('discord.js');
const { Canvas } = require('canvas-constructor');
const fsn = require('fs-nextra');

class GarbageCommentCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_GARBAGE_DESCRIPTION'),
			usage: '[User:user|Image:image]',
			aliases: ['garbage-comment']
		});
	}

	async run(message, [user = message.author]) {
		const result = await this.garbageComment(user);
		await message.channel.send(new MessageAttachment(result, 'garbage_comment.png'));
	}

	async garbageComment(user) {
		const [plate, { body }] = await Promise.all([
			fsn.readFile('../../assets/images/garbage_comment.png'),
			this.client.helper.Miscs.request(this.getImage(user, { format: 'png', size: 256 }))
		]);

		const [width, height] = [750, 721];
		return new Canvas(width, height)
			.setColor('#FFFFFF')
			.addRect(0, 0, width, height)
			.rotate(-10 * Math.PI / 180)
			.addImage(body, 140, 385, 256, 256)
			.rotate(10 * Math.PI / 180)
			.addImage(plate, 0, 0, width, height)
			.toBuffer();
	}

}

module.exports = GarbageCommentCommand;
