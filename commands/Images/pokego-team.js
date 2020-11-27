/**
 * @file pokego-team.js (Command)
 * @author Santosh Bhandari
 * @license GPL-3.0
 */

const { Command } = require('klasa');
const { MessageAttachment } = require('discord.js');
const { Canvas } = require('canvas-constructor');
const fsn = require('fs-nextra');

class PokegoteamCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_POKEGO_TEAM_DESCRIPTION'),
			usage: '<valor|mystic|instinct>',
			aliases: ['pokegoteam']
		});
	}

	async run(message, [team]) {
		const result = await this.buildImage(team, message.author);
		await message.channel.send(new MessageAttachment(result, `${message.author.username}-${team.toLowerCase()}.png`));
	}

	async buildImage(team, user) {
		const [plate, { body }] = await Promise.all([
			fsn.readFile(`../../assets/images/team_${team.toLowerCase()}.png`),
			this.client.helper.Miscs.request(user.displayAvatarURL({ format: 'png', size: 1024 }))
		]);

		return new Canvas(1000, 1000)
			.addImage(body, 0, 0, 1000, 1000)
			.addImage(plate, 0, 0, 1000, 1000)
			.restore()
			.toBuffer();
	}

}

module.exports = PokegoteamCommand;
