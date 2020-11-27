/**
 * @file guess-the-name.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');
const { Collection } = require('discord.js');
const { delay, verifyYesNo } = require('../../../lib/Util');

class GuessTheNameCommand extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			description: ''
		});
		this.games = new Collection();
	}

	async run(msg) {
		if (this.games.has(msg.channel.id)) return msg.sendLocale('COMMAND_GAME_IN_PROGRESS', [this.name]);
		msg.channel.send([
			'Take your time to guess a name. Do not type the name here, but just remember it.',
			'`NOTE:` _Name with 3-9 characters is only accepted._'
		].join('\n'));
		await delay(5000);

		await msg.channel.send('How many characters are there in the name you have thought of ?');
		const filter = (res) => {
			if (res.author.id !== msg.author.id) return false;
			if (isNaN(res.content)) return false;
			if (parseInt(res.content) < 3) return false;
			if (parseInt(res.content) > 9) return false;
			return true;
		};

		const lettersCountRaw = await msg.channel.awaitMessages(filter, { time: 15000, max: 1 });
		const letterCount = parseInt(lettersCountRaw.first().content);

		try {
			this.games.set(msg.channel.id, {
				letters: letterCount,
				group: [
					['A', 'B', 'C', 'D', 'E'],
					['F', 'G', 'H', 'I', 'J'],
					['K', 'L', 'M', 'N', 'O'],
					['P', 'Q', 'R', 'S', 'T'],
					['U', 'V', 'W', 'X', 'Y'],
					['Z']
				]
			});

			// Processing of the actual game...
			await msg.channel.send('I will just ask you to enter few things. After that at the end I will tell you the name you have in your mind.');
			await this.processLettersAccepting(msg);
			await msg.channel.send('Ok I can see a blurred image of the name in your mind. Lets do this again and I will surely tell you the name.');
			await this.processLettersAccepting(msg);
			const name = await this.getName(msg);
			await msg.channel.send(`${msg.author.tag}, Finally! I can see the name all clear. Its **${name.toTitleCase()}**.\nAm I right ??`);
			const correct = await verifyYesNo(msg.channel, msg.author);
			if (correct === 0) return msg.channel.send('Your silence means I am absolutely correct.');
			if (!correct) return msg.channel.send('How is it possible that I am wrong :confused:... I guess you didn\'t tell me wrong column number.');
			return msg.channel.send('Yet another show of my brilliance :wink:');
		} catch (err) {
			this.games.delete(msg.channel.id);
			throw err;
		}
	}

	async processLettersAccepting(msg) {
		const game = this.games.get(msg.channel.id);
		const newGroup = new Array(game.letters);

		for (let i = 0; i < game.letters; i++) {
			// TO-BE-DONE Display the table while asking to enter the column.
			await msg.channel.send(`Enter the column number where the ${i === 0 ? 'first' : i === game.letters - 1 ? 'last' : 'next'} letter is.`);
			const filter = (res) => {
				if (res.author.id !== msg.author.id) return false;
				if (isNaN(res.content)) return false;
				if (parseInt(res.content) < 1) return false;
				if (parseInt(res.content) > game.letters) return false;
				return true;
			};
			const numberMap = await msg.channel.awaitMessages(filter, { time: 15000, max: 1 });
			const number = parseInt(numberMap.first().content) - 1;
			const newGroupElement = this.getNewGrouping(game.group, number);
			newGroup[i] = newGroupElement;
		}
		game.group = newGroup;
	}

	getName(msg) {
		const game = this.games.get(msg.channel.id);
		let name = '';
		for (let i = 0; i < game.column.length; i++) name += game.column[i][i];
		return name;
	}

	getNewGrouping(group, column) {
		const newGroup = [];
		for (let i = 0; i < group.length; i++) if (group[i][column]) newGroup.push(group[i][column]);
		return newGroup;
	}

}

module.exports = GuessTheNameCommand;
