/**
 * @file hitler.js (Command)
 * @author Santosh Bhandari
 * @license GPL-3.0
 */

const Command = require('../../lib/Structures/CommandBase/Images');
const { MessageAttachment } = require('discord.js');
const { Canvas } = require('canvas-constructor');
const fsn = require('fs-nextra');

class HitlerCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_HITLER_DESCRIPTION'),
			usage: '[User:user|Image:image]'
		});
	}

	async run(message, [user = message.author]) {
		const result = await this.worseHitler(user);
		await message.channel.send(new MessageAttachment(result, 'WorsethanHitler.png'));
	}

	async worseHitler(user) {
		const [plate, { body: usrAvatar }] = await Promise.all([
			fsn.readFile('../../assets/images/plate_hitler.png'),
			this.client.helper.Miscs.request(this.getImage(user))
		]);

		return new Canvas(480, 360)
			.setColor('#000000')
			.addRect(0, 0, 480, 360)
			.addImage(usrAvatar, 37, 27, 156, 156)
			.addImage(plate, 0, 0, 480, 360)
			.toBuffer();
	}

}

module.exports = HitlerCommand;
