const Command = require('../../lib/Structures/CommandBase/Pages');

class UrbanCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_NSFW_URBAN_DESCRIPTION'),
			usage: '<Term:str>',
			runIn: ['text'],
			nsfw: true
		});
	}

	async run(msg, [term]) {
		const result = await this.client.helper.API.searchUrbanDictionary(term);

		return this.paginate(msg, result.list);
	}

	generateEmbedPage(list, page) {
		const description = [
			list[page].definition,
			`**❯ Example** : ${list[page].example}`,
			[
				`**❯ ThumbsUP** : ${list[0].thumbs_up}`,
				`**❯ ThumbsDown** : ${list[0].thumbs_down}`
			].join('\n')
		].join('\n\n');

		return this.client.helper.Miscs.getEmbed({ footer: false })
			.setDescription(description)
			.setThumbnail('https://i.imgur.com/ressY86.png')
			.setTitle(`${list[page].word} - Page ${page + 1}/${list.length}`)
			.setURL(`${list[page].permalink}`)
			.setFooter(`Author: ${list[page].author}`);
	}

}

module.exports = UrbanCommand;
