/**
 * @file this-is-beautiful.js (Command)
 * @author Santosh Bhandari
 * @license GPL-3.0
 */

const Command = require('../../lib/Structures/CommandBase/Images');
const { MessageAttachment } = require('discord.js');
const { Canvas } = require('canvas-constructor');
const fsn = require('fs-nextra');

class ThisIsBeautifulCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_BEAUTIFUL_DESCRIPTION'),
			usage: '[User:user|Image:image]'
		});
	}

	async run(message, [user = message.author]) {
		const result = await this.beautify(user);
		await message.channel.send(new MessageAttachment(result, 'beautiful.png'));
	}

	async beautify(user) {
		const [plate, { body: usrAvatar }] = await Promise.all([
			fsn.readFile('../../assets/images/plate_beautiful.png'),
			this.client.helper.Miscs.request(this.getImage(user))
		]);

		return new Canvas(634, 675)
			.setColor('#000000')
			.addRect(0, 0, 634, 675)
			.addImage(usrAvatar, 423, 45, 168, 168)
			.addImage(usrAvatar, 426, 382, 168, 168)
			.addImage(plate, 0, 0, 634, 675)
			.toBuffer();
	}

}

module.exports = ThisIsBeautifulCommand;
