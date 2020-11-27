/**
 * @file Akinator.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');
const { Collection } = require('discord.js');
const { verifyYesNo } = require('../../../lib/Util');

/* eslint-disable camelcase */
/* eslint-disable id-length */
class AkinatorCommand extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: language => language.get('COMMAND_AKINATOR_DESCRIPTION'),
			usage: '[en|jp|de|pt|ar|fr|es|ru|il|cn|it|kr|tr|nl|pl]',
			aliases: ['aki']
		});

		this.games = new Collection();
	}

	async run(msg, [lang = 'en']) {
		if (this.games.has(msg.channel.id)) return msg.sendLocale('COMMAND_GAME_IN_PROGRESS', [this.name]);
		try {
			const data = await this.startNewGame(msg.channel, lang);
			return await this.progressSteps(msg, data);
		} catch (err) {
			this.games.delete(msg.channel.id);
			throw err;
		}
	}

	async progressSteps(msg, data) {
		msg.channel.send(`\`${++data.step}.\` **${data.question}**\n\n${this.getAnswerDisplay(msg.channel.id)}`);

		const filter = res => res.author.id === msg.author.id && this.getAnswerChoices(msg.channel.id).includes(res.content.toLowerCase());
		const msgs = await msg.channel.awaitMessages(filter, {
			max: 1,
			time: 30000
		});

		if (!msgs.size) return msg.channel.send('Time\'s up...');
		const entered = msgs.first().content.toLowerCase();
		if (entered === 'end' || entered === 'stop') return this.endGame(msg);

		data = await this.sendAnswer(msg.channel, msgs.first().content.toLowerCase());
		if (data.step > 80 || data.progression > 95) return this.endGame(msg);
		return await this.progressSteps(msg, data);
	}

	async endGame(msg) {
		const guess = await this.makeGuess(msg.channel);
		const embed = this.client.helper.Miscs.getEmbed()
			.setTitle(`I'm ${Math.round(guess.proba * 100)}% sure it's `)
			.setDescription(`${guess.name}\n${guess.description ? `_${guess.description}_` : ''}`)
			.setImage(guess.absolute_picture_path);
		await msg.sendEmbed(embed);
		const verification = await verifyYesNo(msg.channel, msg.author);
		this.games.delete(msg.channel.id);
		if (verification === 0) return msg.channel.send('I guess your silence means I have won.');
		if (!verification) return msg.channel.send('Woah, you defeated me.');
		return msg.channel.send('Yeah, I guess it right one more time!');
	}

	async sendAnswer(channel, answer) {
		answer = this.getAnswer(channel.id, answer);
		const { url, id: session, signature, step } = this.games.get(channel.id);
		const { body } = await this.client.helper.Miscs.request(`${url}/ws/answer`)
			.query({
				session,
				signature,
				step,
				answer,
				question_filter: channel.nsfw ? '' : 'cat=1',
				_: Date.now()
			});

		if (body.completion !== 'OK') throw 'There is some error starting the game. If the error remians, contact the bot developers as soon as possible.';

		const data = body.parameters;
		this.games.set(channel.id, {
			url,
			id: session,
			signature: signature,
			step: Number.parseInt(data.step, 10),
			progression: Number.parseInt(data.progression, 10),
			answers: data.answers
		});
		return data;
	}

	async startNewGame(channel, language) {
		const url = this.getURL(language);
		const { body } = await this.client.helper.Miscs.request(`${url}/ws/new_session`)
			.query({
				partner: 1,
				player: 'website-desktop',
				constraint: 'ETAT<>\'AV\'',
				soft_constraint: channel.nsfw ? '' : 'ETAT=\'EN\'',
				question_filter: channel.nsfw ? '' : 'cat=1',
				_: Date.now()
			});
		if (body.completion !== 'OK') throw 'There is some error starting the game. If the error remians, contact the bot developers as soon as possible.';

		const data = body.parameters;
		this.games.set(channel.id, {
			url,
			id: data.identification.session,
			signature: data.identification.signature,
			step: 0,
			progression: Number.parseInt(data.step_information.progression, 10),
			answers: data.step_information.answers
		});
		return data.step_information;
	}

	async makeGuess(channel) {
		const { url, id: session, signature, step } = this.games.get(channel.id);
		const { body } = await this.client.helper.Miscs.request(`${url}/ws/list`)
			.query({
				session,
				signature,
				step,
				size: 2,
				pref_photos: 'VO-OK',
				duel_allowed: 1,
				mode_question: 0,
				_: Date.now()
			});

		if (!body.parameters) throw 'There is some error, please try again later.';
		return body.parameters.elements[0].element;
	}

	getAnswer(channelID, ans) {
		const { answers } = this.games.get(channelID);

		switch (ans.toLowerCase()) {
			case answers[0].answer.toLowerCase():
			case 'yes':
			case 'y':
				return 0;
			case answers[1].answer.toLowerCase():
			case 'no':
			case 'n':
				return 1;
			case answers[2].answer.toLowerCase():
			case 'dont know':
			case 'd':
			case 'dn':
				return 2;
			case answers[3].answer.toLowerCase():
			case 'probably':
			case 'p':
				return 3;
			case answers[4].answer.toLowerCase():
			case 'probably not':
			case 'pn':
				return 4;
			default:
				return null;
		}
	}

	getAnswerChoices(channID) {
		const choices = ['yes', 'y', 'no', 'n', 'dont know', 'dn', 'd', 'probably', 'p', 'probably not', 'pn', 'end', 'stop'];
		const { answers } = this.games.get(channID);
		for (let i = 0; i < answers.length; i++) {
			const sAns = answers[i].answer.toLowerCase();
			if (!choices.filter(ch => ch === sAns).length) choices.push(sAns);
		}
		return choices;
	}

	getAnswerDisplay(channID) {
		const display = ['Yes (**y**)', 'No (**n**)', 'Dont know (**dn**)', 'Probably (**p**)', 'Probably not (**pn**)'];
		const final = [];

		const { answers } = this.games.get(channID);
		for (let i = 0; i < answers.length; i++) {
			final.push(`\`-\` **${answers[i].answer.toLowerCase()}** | ${display[i]}`);
		}
		final.push('`-` **end** | **stop**');
		return final.join('\n');
	}

	getURL(language) {
		switch (language.toLowerCase()) {
			case 'jp':
				return 'https://srv11.akinator.com:9172';
			case 'de':
				return 'https://srv7.akinator.com:9145';
			case 'pt':
				return 'https://srv3.akinator.com:9166';
			case 'ar':
				return 'https://srv2.akinator.com:9155';
			case 'fr':
				return 'https://srv3.akinator.com:9165';
			case 'es':
				return 'https://srv6.akinator.com:9127';
			case 'ru':
				return 'https://srv5.akinator.com:9124';
			case 'il':
				return 'https://srv4.akinator.com:9170';
			case 'cn':
				return 'https://srv11.akinator.com:9150';
			case 'it':
				return 'https://srv9.akinator.com:9131';
			case 'kr':
				return 'https://srv2.akinator.com:9156';
			case 'tr':
				return 'https://srv3.akinator.com:9164';
			case 'nl':
				return 'https://srv9.akinator.com:9133';
			case 'pl':
				return 'https://srv7.akinator.com:9143';
			case 'en':
			default:
				return 'https://srv6.akinator.com:9126';
		}
	}

}

module.exports = AkinatorCommand;
