/**
 * @file Trivia.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');
const { Collection } = require('discord.js');

class TriviaCommand extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: language => language.get('COMMAND_TRIVIA_DESCRIPTION')
		});
		this.games = new Collection();
	}

	async run(msg) {
		if (this.games.has(msg.channel.id)) return msg.sendLocale('COMMAND_GAME_IN_PROGRESS', [this.name]);

		try {
			const gameData = await this.getData(msg.channel.id);

			const embed = this.client.helper.Miscs.getEmbed({ footer: false })
				.setTitle(`${gameData.category} - ${gameData.difficulty}`)
				.setThumbnail('https://i.imgur.com/zPtu5aP.png')
				.setDescription(gameData.question)
				.addField('Options', gameData.answers.map(a => `• ${a}`).join('\n'));
			await msg.sendEmbed(embed);

			return await this.handleProgress(msg, 30000, 0);
		} catch (err) {
			this.games.delete(msg.channel.id);
			throw err;
		}
	}

	async handleProgress(msg, time, count) {
		const gameData = this.games.get(msg.channel.id);

		if (count >= 2) {
			msg.sendLocale('COMMAND_TRIVIA_NO_CORRECT_GUESS', [gameData.correctAnswer]);
			return this.games.delete(msg.channel.id);
		}

		// awaiting for the messages
		try {
			const attempts = await msg.channel.awaitMessages(mesg => !mesg.author.bot, { max: 1, time: time, errors: ['time'] });
			const selection = attempts.first();
			if (selection.content.toLowerCase() === gameData.correctAnswer.toLowerCase()) {
				msg.sendLocale('COMMAND_TRIVIA_CORRECT_GUESS', [selection.author.tag, gameData.correctAnswer]);
				return this.games.delete(msg.channel.id);
			} else {
				return await this.handleProgress(msg, 30000 - (selection.createdTimestamp - msg.createdTimestamp), count + 1);
			}
		} catch (error) {
			msg.sendLocale('COMMAND_TRIVIA_NO_GUESS', [gameData.correctAnswer]);
			return this.games.delete(msg.channel.id);
		}
	}

	async getData(channelID) {
		const { body } = await this.client.helper.Miscs.request('https://opentdb.com/api.php')
			.query({
				amount: 1,
				type: 'multiple'
			});
		const info = body.results[0];

		const obj = {
			question: decodeURIComponent(info.question),
			answers: [],
			correctAnswer: decodeURIComponent(info.correct_answer),
			category: info.category,
			difficulty: info.difficulty
		};

		for (const optn of info.incorrect_answers) obj.answers.push(decodeURIComponent(optn));
		obj.answers.push(decodeURIComponent(info.correct_answer));
		obj.answers = obj.answers.shuffle();

		this.games.set(channelID, obj);
		return obj;
	}

}

module.exports = TriviaCommand;
