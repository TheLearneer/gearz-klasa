/**
 * @file fear.js (Command)
 * @author Santosh Bhandari
 * @license GPL-3.0
 */

const Command = require('../../lib/Structures/CommandBase/Images');
const { MessageAttachment } = require('discord.js');
const { Canvas } = require('canvas-constructor');
const fsn = require('fs-nextra');

class FearCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_FEAR_DESCRIPTION'),
			usage: '[User:user|Image:image]'
		});
	}

	async run(message, [user = message.author]) {
		const result = await this.fearNoMan(user);
		await message.channel.send(new MessageAttachment(result, 'fear-No-Man.png'));
	}

	async fearNoMan(user) {
		const [plate, { body: usrAvatar }] = await Promise.all([
			fsn.readFile('../../assets/images/fear.png'),
			this.client.helper.Miscs.request(this.getImage(user))
		]);

		return new Canvas(772, 772)
			.setColor('white')
			.addRect(0, 0, 772, 772)
			.addRect(0, 0, 480, 360)
			.addImage(usrAvatar, 259, 514, 256, 256)
			.addImage(plate, 0, 0, 772, 772)
			.toBuffer();
	}

}

module.exports = FearCommand;
