/**
 * @file door.js (Command)
 * @author Santosh Bhandari
 * @license GPL-3.0
 */

const Command = require('../../lib/Structures/CommandBase/Images');
const { MessageAttachment } = require('discord.js');
const { Canvas } = require('canvas-constructor');
const fsn = require('fs-nextra');

class DoorCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_DOOR_DESCRIPTION'),
			usage: '[User:user|Image:image]'
		});
	}

	async run(message, [user = message.author]) {
		const result = await this.insideTheDoor(user);
		await message.channel.send(new MessageAttachment(result, 'I Dont wanna go inside.png'));
	}

	async insideTheDoor(user) {
		const [plate, { body: usrAvatar }] = await Promise.all([
			fsn.readFile('../../assets/images/door.png'),
			this.client.helper.Miscs.request(this.getImage(user, { format: 'png', size: 512 }))
		]);

		return new Canvas(1000, 480)
			.setColor('#FFFFFF')
			.addRect(0, 0, 1000, 480)
			.addImage(usrAvatar, 272, 14, 450, 450)
			.addImage(plate, 0, 0, 1000, 480)
			.toBuffer();
	}

}

module.exports = DoorCommand;
