/**
 * @file best_guess.js (Command)
 * @author Santosh Bhandari
 * @license GPL-3.0
 */

const Command = require('../../lib/Structures/CommandBase/Images');
const { MessageAttachment } = require('discord.js');
const { Canvas } = require('canvas-constructor');
const fsn = require('fs-nextra');

class BestGuessIsGODCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_BEST_GUESS_DESCRIPTION'),
			usage: '[User:user|Image:image]',
			aliases: ['best-guess']
		});
		this.loadingString = 'Getting my best guess for this image ...';
	}

	async run(msg, [user = msg.author]) {
		const result = await this.bestGuessing(user);
		await msg.deleteLoader();
		await msg.channel.send(new MessageAttachment(result, 'best-guess-is-god.png'));
	}

	async bestGuessing(user) {
		const [plate, { body }] = await Promise.all([
			fsn.readFile('../../assets/images/best_guess.png'),
			this.client.helper.Miscs.request(this.getImage(user, { size: 256, format: 'png' }))
		]);

		return new Canvas(618, 303)
			.setColor('#ffffff')
			.addRect(0, 0, 618, 303)
			.addImage(body, 38, 23, 154, 154)
			.addImage(plate, 0, 0, 618, 303)
			.toBuffer();
	}

}

module.exports = BestGuessIsGODCommand;
