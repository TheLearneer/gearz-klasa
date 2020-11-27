/**
 * @file catgirl.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class CatGirlCommand extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			description: language => language.get('COMMAND_CATGIRL_DESCRIPTION')
		});
	}

	async run(message) {
		const result = await this.client.helper.API.getCatgirl(message.channel.nsfw);
		const embed = this.client.helper.Miscs.getEmbed({ text: 'Powered by https://nekos.moe' })
			.setTitle('Cat girl')
			.setImage(result);
		message.sendEmbed(embed);
	}

}

module.exports = CatGirlCommand;
