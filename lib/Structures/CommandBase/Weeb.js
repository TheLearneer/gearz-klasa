const { Command } = require('klasa');
const { keys } = require('../../../config');

class WeebCommandBase extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			cooldown: 10,
			runIn: ['text']
		});
	}

	async run(msg, [user]) {
		if (!this.weeb) throw `**${this.name}** Command is buggy. Please contact the bot developers as soon as possible.`;

		const embed = await this.getWeebImage(this.weeb.type, msg.channel.nsfw);
		if (this.weeb.description && user) embed.setDescription(this.weeb.description(msg.author, user));

		return await msg.sendEmbed(embed);
	}

	async getWeebImage(type, nsfw = false) {
		const { body } = await this.client.helper.Miscs.request('https://api.weeb.sh/images/random')
			.query({ type, nsfw })
			.set('Authorization', keys.Weeb);

		return this.client.helper.Miscs.getEmbed({ text: 'Powered by Weeb.sh' })
			.setTitle('Click here if the image doesn\'t load ...')
			.setURL(body.url)
			.setImage(body.url);
	}

}

module.exports = WeebCommandBase;
