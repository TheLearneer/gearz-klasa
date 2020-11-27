/**
 * @file delete.js (Command)
 * @author Santosh Bhandari
 * @license GPL-3.0
 */

const Command = require('../../lib/Structures/CommandBase/Images');
const { MessageAttachment } = require('discord.js');
const { Canvas } = require('canvas-constructor');
const fsn = require('fs-nextra');
const { resolve, join } = require('path');
Canvas.registerFont(resolve(join(__dirname, '../../assets/fonts/Raleway-Bold.ttf')), 'Raleway');

class DeleteGarbageCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_DELETE_DESCRIPTION'),
			usage: '[User:user]'
		});
	}

	async run(message, [user = message.author]) {
		const result = await this.deleteGarbage(user);
		await message.channel.send(new MessageAttachment(result, 'delete-the-garbage.png'));
	}

	async deleteGarbage(user) {
		const [plate, { body: usrAvatar }] = await Promise.all([
			fsn.readFile('../../assets/images/plate_delete.png'),
			this.client.helper.Miscs.request(user.displayAvatarURL({ format: 'png', size: 128 }))
		]);

		return new Canvas(400, 200)
			.setColor('#ffffff')
			.addRect(5, 5, 400, 200)
			.addImage(usrAvatar, 50, 80, 69, 69)
			.addImage(plate, 0, 0, 400, 200)
			.setColor('#484848')
			.setTextFont('12px Raleway')
			.addText(user.tag, 215, 90)
			.toBuffer();
	}

}

module.exports = DeleteGarbageCommand;
