/**
 * @file reddit.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class RedditSearchCommand extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get(''),
			usage: '<Subreddit:string> [new|top|hot]'
		});
	}

	async run(msg, [subreddit, category = 'random']) {
		const { body } = await this.client.helper.Miscs.request(`https://www.reddit.com/r/${subreddit}/${category}.json`);
		const meme = body.data.children.random().data;

		if (!msg.channel.nsfw && meme.over_18) return await msg.sendLocale('NSFW_CONTENT_PROHIBITED');

		const embed = this.client.helper.Miscs.getEmbed({ footer: false })
			.setAuthor(`${meme.subreddit_name_prefixed}`, 'http://i.imgur.com/sdO8tAw.png', `https://www.reddit.com${meme.permalink}`)
			.addField('Author', `[${meme.author}](https://reddit/com/u/${meme.author})`, true)
			.addField('Title', meme.title);
		if (meme.upvote_ratio) {
			embed.addField('Upvote Ratio', meme.upvote_ratio, true)
				.addField('URL', meme.url);
		}

		return await msg.sendEmbed(embed);
	}

}

module.exports = RedditSearchCommand;
