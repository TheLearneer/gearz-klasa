/**
 * @file quiz.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');
const { Collection } = require('discord.js');
const { gk } = require('../../../assets/data/gk');
const { getUniqueRandom, awaitPlayers } = require('../../../lib/Util');

class QuizCommand extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: language => language.get('COMMAND_QUIZ_DESCRIPTION')
		});
		this.games = new Collection();
	}

	async run(msg) {
		// Checking if another game is already being played in the channel, if not start a new game...
		if (this.games.has(msg.channel.id)) return msg.sendLocale('COMMAND_GAME_IN_PROGRESS', [this.name]);

		// Letting more people join the quiz if they are interested.
		await msg.sendLocale('COMMAND_QUIZ_MORE_IS_BETTER');
		const awaitedPlayer = await awaitPlayers(msg, 1, 10, { text: 'join quiz' });

		try {
			this.games.set(msg.channel.id, {
				questions: gk,
				users: awaitedPlayer.map(user => ({
					user,
					points: 0
				})),
				steps: 50
			});

			return await this.progressQuiz(msg);
		} catch (err) {
			this.games.delete(msg.channel.id);
			throw err;
		}
	}

	async progressQuiz(msg, step = 1) {
		const game = this.games.get(msg.channel.id);

		if (step > game.setps || this.games.question.length < 1) {
			const allPlayers = Array.from(game.users.map(user => ({
				user: user.tag,
				points: user.points
			})));
			const pointsTable = allPlayers.sort((a, b) => b.points - a.points);
			const pointsDisplay = pointsTable.map(player => `${player.user} :: ${player.points}`).join('\n');
			const winner = pointsTable[0];

			if (game.users.size > 1) {
				await msg.channel.send(msg.language.get('COMMAND_QUIZ_OVER_MULTIPLE', pointsDisplay, winner));
			} else {
				await msg.channel.send(msg.language.get('COMMAND_QUIZ_OVER_SINGLE', `${winner.points} / ${game.setps}`, winner.user));
			}
			return this.games.delete(msg.channel.id);
		}

		// Getting a random question for the quiz, and sending it to the channel.
		const question = this.getQuestion(msg.channel.id);
		await msg.channel.send(question.question);

		const filter = (res) => {
			const validIDs = game.users.map(usr => usr.user.id);
			if (validIDs.includes(res.author.id)) return true;
			return false;
		};

		const answers = await msg.channel.awaitMessages(filter, { max: 1, time: 15000 });
		if (!answers.size) {
			// TO-BE-DONE
			/**
			 *  send message in the format
			 * No one answered.
			 * Q: Question ?
			 * A: Answer....
			 */
			const { answer: CorrectAnswer } = this.verifyAnswer(question, 'WRONG.....');
			await msg.channel.send(`Oops! ${game.user.size > 1 ? 'no one answered' : `${msg.author.username}, you didn't answer`} the question. Correct answer is ${CorrectAnswer}`);
			return await this.progressQuiz(msg, step + 1);
		}

		const answer = this.verifyAnswer(question, answers.first().content);
		// TO-BE-DONE
		/**
		 * Send message in the format
		 * Not correct | User got right.
		 * Q: Question ?
		 * A: Answer....
		 */
		msg.channel.send(answer.correct ?
			`${answers.first().user.username} got it right. Correct Answer is ${answer.answer}` :
			`Oops, that's not the correct answer. Correct answer is ${answer.answer}`);

		// Giving the first user to answer the point if the answer is correct.
		if (answer.correct) game.users.get(answers.first().author.id).points += 1;

		return await this.progressQuiz(msg, step + 1);
	}

	getQuestion(channelID) {
		const game = this.games.get(channelID);
		const { randomEntry, filteredArray } = getUniqueRandom(game.questions);
		game.questions = filteredArray;
		return randomEntry;
	}

	verifyAnswer(questionAnswer, ans) {
		const answer = { questionAnswer };
		if (typeof answer === 'string') {
			if (answer.toLowerCase() === ans.toLowerCase()) return { correct: true, answer };
		} else {
			for (const answ of answer) if (answ.toLowerCase() === ans.toLowerCase()) return { correct: true, answer: answer.join(' | ') };
		}
		return { correct: false, answer: typeof answer === 'string' ? answer : answer.join(' | ') };
	}

}

module.exports = QuizCommand;
