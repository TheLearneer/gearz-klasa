/**
 * @file bobross.js (Command)
 * @author Santosh Bhandari
 * @license GPL-3.0
 */

const Command = require('../../lib/Structures/CommandBase/Images');
const { MessageAttachment } = require('discord.js');
const { Canvas } = require('canvas-constructor');
const fsn = require('fs-nextra');

class BobRossCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_BOBROSS_DESCRIPTION'),
			usage: '[User:user|Image:image]',
			aliases: ['bob-ross']
		});
		this.loadingString = 'bobross has begun... Painting will be here any moment now.';
	}

	async run(msg, [user = msg.author]) {
		const result = await this.bobRoss(user);
		await msg.deleteLoader();
		await msg.channel.send(new MessageAttachment(result, 'bobRoss.png'));
	}

	async bobRoss(user) {
		const [plate, { body }] = await Promise.all([
			fsn.readFile('../../assets/images/bobross.png'),
			this.client.helper.Miscs.request(this.getImage(user, { format: 'png', size: 2048 }))
		]);

		const [width, height] = [600, 775];
		return new Canvas(width, height)
			.setColor('#FFFFFF')
			.addRect(0, 0, width, height)
			.addImage(body, 22, 32, 430, 430)
			.addImage(plate, 0, 0, width, height)
			.toBuffer();
	}

}

module.exports = BobRossCommand;
