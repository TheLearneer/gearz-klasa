/**
 * @file legend.js (Command)
 * @author Santosh Bhandari
 * @license GPL-3.0
 */

const Command = require('../../lib/Structures/CommandBase/Images');
const { MessageAttachment } = require('discord.js');
const { Canvas } = require('canvas-constructor');
const fsn = require('fs-nextra');

class LegendCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_LEGEND_DESCRIPTION'),
			usage: '[User:user|Image:image]'
		});
	}

	async run(message, [user = message.author]) {
		const result = await this.trueLegend(user);
		await message.channel.send(new MessageAttachment(result, 'A-true-legend.png'));
	}

	async trueLegend(user) {
		const [plate, { body: usrAvatar }] = await Promise.all([
			fsn.readFile('../../assets/images/plate_legend.png'),
			this.client.helper.Miscs.request(this.getImage(user, { format: 'png', size: 256 }))
		]);

		return new Canvas(398, 398)
			.setColor('#FFFFFF')
			.addRect(0, 0, 398, 398)
			.addImage(usrAvatar, 92, 67, 215, 215)
			.addImage(plate, 0, 0, 398, 398)
			.toBuffer();
	}

}

module.exports = LegendCommand;
