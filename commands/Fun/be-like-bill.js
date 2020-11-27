/**
 * @file be-like-bill.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');
const { Canvas } = require('canvas-constructor');
const fsn = require('fs-nextra');
const { resolve, join } = require('path');

const { getBillTalks } = require('../../assets/data/be_like_bill');

Canvas.registerFont(resolve(join(__dirname, '../../assets/fonts/Noto-Regular.ttf')), 'Noto');
Canvas.registerFont(resolve(join(__dirname, '../../assets/fonts/Noto-Regular.ttf')), 'Noto');

class BeLikeBillCommand extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_BE_LIKE_BILL_DESCRIPTION'),
			usage: '[Name:user|Name:str]',
			aliases: ['bill']
		});
	}

	async run(msg, [user = 'Bill']) {
		const image = await this.getBillImage(user);
		return msg.channel.send({ files: [{ attachment: image, name: 'be_like_bill.png' }] });
	}

	async getBillImage(user) {
		const name = typeof user === 'string' ? user : user.username;
		const text = [
			`This is ${name}.`,
			' ',
			`${getBillTalks(name)}`,
			' ',
			`${name} is smart.`,
			`Be like ${name}.`
		].join('\n\n');

		const plate = await fsn.readFile('../../assets/images/be_like_bill.png');
		return new Canvas(800, 420)
			.addImage(plate, 0, 0, 800, 420)
			.setTextFont('23px Noto')
			.addMultilineText(text, 30, 80, 550, 80)
			.toBuffer();
	}

}

module.exports = BeLikeBillCommand;
