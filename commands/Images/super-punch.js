/**
 * @file super-punch.js (Command)
 * @author Santosh Bhandari
 * @license GPL-3.0
 */

const Command = require('../../lib/Structures/CommandBase/Images');
const { MessageAttachment } = require('discord.js');
const { Canvas } = require('canvas-constructor');
const fsn = require('fs-nextra');

class PunchCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_SUPER_PUNCH_DESCRIPTION'),
			usage: '[User:user|Image:image]'
		});
	}

	async run(message, [user = message.author]) {
		const result = await this.punchUser(message.author, user);
		await message.channel.send(new MessageAttachment(result, 'punch.png'));
	}

	async punchUser(puncher, user) {
		const [plate, { body: avatar }, { body: hitter }] = await Promise.all([
			fsn.readFile('../../assets/images/image_punch.png'),
			this.client.helper.Miscs.request(this.getImage(user)),
			this.client.helper.Miscs.request(puncher.displayAvatarURL({ format: 'png', size: 128 }))
		]);
		return new Canvas(650, 633)
			.addImage(plate, 0, 0, 650, 633)
			.addImage(hitter, 379, 49, 102, 102, { type: 'round', radius: 51 })
			.restore()
			.rotate(180 * Math.PI / 180)
			.addImage(avatar, -159, -301, 110, 110, { type: 'round', radius: 55 })
			.restore()
			.toBuffer();
	}

}

module.exports = PunchCommand;
