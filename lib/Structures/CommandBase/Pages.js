const { Command } = require('klasa');

class PagesCommand extends Command {

	constructor(...args) {
		super(...args);

		this.buttons = ['⬅', '➡', '🛑'];
	}

	async paginate(message, list) {
		if (list.length === 1) return await message.sendEmbed(this.generateEmbedPage(list, 0));

		const msg = await message.send('`Loading please wait...`');
		for (let i = 0; i < this.buttons.length; i++) await msg.react(this.buttons[i]);

		const embed = await message.sendEmbed(this.generateEmbedPage(list, 0));
		return await this.processPages(message, embed, list, 0);
	}

	async processPages(msg, embed, list, page) {
		try {
			const reactions = await embed.awaitReactions((rec, user) => user.id === msg.author.id && this.buttons.includes(rec.emoji.toString()), {
				time: 30000,
				max: 1,
				errors: ['time']
			});
			const reacted = reactions.first();
			switch (reacted._emoji.name) {
				case '⬅':
					page -= 1;
					break;
				case '➡':
					page += 1;
					break;
				case '🛑':
					return embed.reactions.removeAll().catch(() => null);
			}

			if (page < 0 || page >= list.length) {
				page = page < 0 ? 0 : list.length - 1;
				reacted.users.remove(msg.author).catch(() => null);
				return await this.processPages(msg, embed, list, page);
			}

			embed.edit(this.generateEmbedPage(list, page));
			reacted.users.remove(msg.author).catch(() => null);
			return await this.processPages(msg, embed, list, page);
		} catch (err) {
			return embed.reactions.removeAll().catch(() => null);
		}
	}

}

module.exports = PagesCommand;
