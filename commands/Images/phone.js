/**
 * @file phone.js (Command)
 * @author Santosh Bhandari
 * @license GPL-3.0
 */

const Command = require('../../lib/Structures/CommandBase/Images');
const { MessageAttachment } = require('discord.js');
const { Canvas } = require('canvas-constructor');
const fsn = require('fs-nextra');

class PhoneCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_PHONE_DESCRIPTION'),
			usage: '[User:user|Image:image]'
		});
	}

	async run(message, [user = message.author]) {
		const result = await this.triedStealing(user);
		await message.channel.send(new MessageAttachment(result, 'treidStealingPhone.png'));
	}

	async triedStealing(user) {
		const [plate, { body: usrAvatar }] = await Promise.all([
			fsn.readFile('../../assets/images/phone.png'),
			this.client.helper.Miscs.request(this.getImage(user, { format: 'png', size: 512 }))
		]);

		return new Canvas(420, 480)
			.setColor('#000000')
			.addRect(0, 0, 420, 480)
			.addImage(usrAvatar, 0, 83, 420, 405)
			.addImage(plate, 0, 0, 420, 480)
			.toBuffer();
	}

}

module.exports = PhoneCommand;
