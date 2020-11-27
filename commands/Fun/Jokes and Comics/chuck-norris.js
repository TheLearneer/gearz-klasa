/**
 * @file chuck-norris.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class ChuckNorrisJokeCommand extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_CHUCK_DESCRIPTION'),
			aliases: ['chuck'],
			usage: '[explicit|dev|movie|food|celebrity|science|sport|political|religion|animal|history|music|travel|career|money|fashion]'
		});
	}

	async run(message, [category]) {
		const result = await this.client.helper.API.getChuckNorrisJoke(category);
		const embed = this.client.helper.Miscs.getEmbed({ text: 'Powered by api.chucknorris.io' })
			.setTitle('Chuck Norris')
			.setURL(result.url)
			.setThumbnail('https://assets.chucknorris.host/img/avatar/chuck-norris.png')
			.setDescription(result.value);
		return message.sendEmbed(embed);
	}

}

module.exports = ChuckNorrisJokeCommand;
