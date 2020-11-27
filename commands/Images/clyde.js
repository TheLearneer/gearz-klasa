/**
 * @file clyde.js (Command)
 * @author Santosh Bhandari
 * @license GPL-3.0
 */

const Command = require('../../lib/Structures/CommandBase/Images');
const { MessageAttachment } = require('discord.js');
const { Canvas } = require('canvas-constructor');
const fsn = require('fs-nextra');

class ClydeCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_CLYDE_DESCRIPTION'),
			usage: '<Message:str>'
		});
		this.customizeResponse('Message', 'You must provide the text you want clyde to message.');
	}

	async run(message, [texts]) {
		const result = await this.clydeBlocked(texts);
		await message.channel.send(new MessageAttachment(result, 'clyde_message.png'));
	}

	async clydeBlocked(texts) {
		const [plateTop, plateBottom] = await Promise.all([
			fsn.readFile('../../assets/images/clydeTop.png'),
			fsn.readFile('../../assets/images/clydeBottom.png')
		]);

		return new Canvas(864, 185)
			.setColor('#35383d')
			.measureText(texts, (size) => {
				const newHeight = size.width / 850;
				let totalFinalHeight = 185;
				/* eslint-disable no-invalid-this */
				if (newHeight > 0) {
					totalFinalHeight += newHeight * 53;
					this.changeCanvasHeigth(totalFinalHeight)
						.addRect(0, 0, 864, totalFinalHeight);
					if (parseInt(newHeight) > 0) this.addImage(plateBottom, 0, totalFinalHeight - 113, 864, 72);
					else this.addImage(plateBottom, 0, 113, 864, 72);
				} else {
					this.addRect(0, 0, 864, totalFinalHeight)
						.addImage(plateBottom, 0, 113, 864, 72);
				}
				this.addImage(plateTop, 0, 0, 864, 113);
				/* eslint-disable no-invalid-this */
			})
			.setColor('#c7c7c7')
			.setTextFont('20px Sans Serif')
			.addMultilineText(texts, 117, 95, 750, 20)
			.toBuffer();
	}

}

module.exports = ClydeCommand;
