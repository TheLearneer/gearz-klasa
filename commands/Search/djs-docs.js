const { Command } = require('klasa');

class DjsDocs extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_DJS_DOCS_DESCRIPTION'),
			usage: '[master|stable] <query:str>',
			aliases: ['djs'],
			permissionLevel: 10
		});
		this.hidden = true;
	}

	async run(msg, [branch = 'stable', query]) {
		const { body } = await this.client.helper.Miscs.request(`https://djsdocs.sorta.moe/main/${branch}/embed`)
			.query({ q: query }); // eslint-disable-line id-length
		return msg.sendEmbed(body);
	}

}

module.exports = DjsDocs;

/*
const { Command } = require('klasa');

class DjsDocs extends Command {

	constructor(...args) {
		super(...args, {
			subcommands: true,
			description: language => language.get('COMMAND_DJS_DOCS_DESCRIPTION'),
			usage: '<master|stable:default> <query:str> [...]',
			usageDelim: ' ',
			aliases: ['djs'],
			permissionLevel: 10
		});
		this.hidden = true;
	}

	async master(message, query) {
		return await this.requestAndSend(message, 'master', query.join(' '));
	}

	async stable(message, query) {
		return await this.requestAndSend(message, 'stable', query.join(' '));
	}

	async requestAndSend(message, branch, query) {
		const { body } = await this.client.helper.Miscs.request(`https://djsdocs.sorta.moe/main/${branch}/embed`)
			.query({ q: query }); // eslint-disable-line id-length
		return message.sendEmbed(body);
	}

}

module.exports = DjsDocs;
*/
