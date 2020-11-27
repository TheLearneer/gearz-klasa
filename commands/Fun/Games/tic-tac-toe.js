/**
 * @file tic-tac-toe.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');
const { Collection } = require('discord.js');
const { verifyYesNo } = require('../../../lib/Util');

class TicTacToeCommand extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			requiredPermissions: [],
			description: language => language.get('COMMAND_TTT_DESCRIPTION'),
			usage: '<Opponent:member>'
		});
		this.customizeResponse('Opponent', language => language.get('COMMAND_MUST_MENTION_TO_PLAY'));

		this.games = new Collection();
		this.numbers = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];
	}

	async run(msg, [member]) {
		// Checking if another game is already being played in the channel.
		if (this.games.has(msg.channel.id)) return msg.sendLocale('COMMAND_GAME_IN_PROGRESS', [this.name]);

		// Checking if challenged a valid user.
		if (member.user.bot) return msg.sendLocale('COMMAND_BOTS_CANNOT_PLAY');
		if (member === msg.member) return msg.sendLocale('COMMAND_CANNOT_PLAY_ONESELF');

		// asking the mentioned user if he/she really want to play
		await msg.sendLocale('COMMAND_CHALLENGED_FOR_GAME', [`**${this.name}**`, member.user.tag, `**${msg.author.username}**`]);
		const challengeAccepted = await verifyYesNo(msg.channel, member.user, 15000);

		// The user declined to play so terminating the command hereby with a message.
		if (!challengeAccepted) return msg.sendLocale('COMMAND_DECLINED_TO_PLAY', [`**${member.user.username}**`, msg.author]);

		try {
			this.games.set(msg.channel.id, {
				remaining: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				players: [msg.author, member.user],
				choice: 0,
				table: [
					['1⃣', '2⃣', '3⃣'],
					['4⃣', '5⃣', '6⃣'],
					['7⃣', '8⃣', '9⃣']
				]
			});

			return await this.progress(msg);
		} catch (err) {
			this.games.delete(msg.channel.id);
			throw err;
		}
	}

	async progress(msg) {
		// The basic declarations
		const channelGame = this.games.get(msg.channel.id);
		const currentUser = channelGame.players[channelGame.choice % 2];

		// getting the table for the current TURN.
		await msg.channel.send(this.getTurnTable(msg));

		try {
			const filter = res => {
				const value = res.content.toLowerCase();
				return res.author === currentUser && channelGame.remaining.includes(parseInt(value));
			};

			const messages = await msg.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] });
			const selection = parseInt(messages.first().content.toLowerCase());

			/*
			if (!this.checkUsable(msg, selection)) {
				msg.channel.send(msg.language.get('COMMAND_TTT_ALREADY_USED', currentUser, this.numbers[selection - 1])).then(sent => {
					sent.delete({ timeout: 5000 });
				});
				return this.progress(msg);
			}*/

			// Updating the table with selection
			this.updateTable(msg, selection);

			// Checking if someone won the game
			if (this.checkGameWon(msg)) {
				this.games.delete(msg.channel.id);
				return await msg.channel.send(msg.language.get('COMMAND_GAME_WIN', `**${currentUser.username}**`, this.getTable(channelGame.table)));
			}

			// Checking if the game is draw
			if (this.checkGameOver(msg)) {
				this.games.delete(msg.channel.id);
				return await msg.channel.send(msg.language.get('COMMAND_GAME_DRAW', this.getTable(channelGame.table)));
			}

			channelGame.choice += 1;
			return await this.progress(msg);
		} catch (err) {
			channelGame.choice += 1;
			const winner = channelGame.players[channelGame.choice % 2];
			msg.channel.send(msg.language.get('COMMAND_INACTIVE_WIN', `**${winner.username}**`, this.getTable(channelGame.table)));
			return this.games.delete(msg.channel.id);
		}
	}

	getPosition(number) {
		switch (number) {
			case 1: return [0, 0];
			case 2: return [0, 1];
			case 3: return [0, 2];
			case 4: return [1, 0];
			case 5: return [1, 1];
			case 6: return [1, 2];
			case 7: return [2, 0];
			case 8: return [2, 1];
			case 9: return [2, 2];
			default: return null;
		}
	}

	checkGameOver(msg) {
		const { table } = this.games.get(msg.channel.id);
		for (let i = 0; i < 2; i++) {
			for (let j = 0; j < 2; j++) {
				if (this.numbers.includes(table[i][j])) return false;
			}
		}
		return true;
	}

	checkUsable(msg, number) {
		const { table } = this.games.get(msg.channel.id);
		const [xPos, yPos] = this.getPosition(number);
		return this.numbers.includes(table[xPos][yPos]);
	}

	updateTable(msg, number) {
		const game = this.games.get(msg.channel.id);
		game.remaining = game.remaining.filter(num => num !== number);
		const color = this.getColor(msg);
		const [xPos, yPos] = this.getPosition(number);

		game.table[xPos][yPos] = color;
	}

	getTurnTable(msg) {
		const { table, choice, players } = this.games.get(msg.channel.id);
		return [
			`It's turn of: ${players[choice % 2]}`,
			this.getTable(table)
		].join('\n\n');
	}

	getTable(table) {
		return table.map(row => row.join(' | ')).join('\n-----------------\n');
	}

	checkGameWon(msg) {
		const { table } = this.games.get(msg.channel.id);
		const color = this.getColor(msg);

		// horizontal & vertical check
		for (let i = 0; i < 3; i++) {
			if (table[i][0] === color && table[i][1] === color && table[i][2] === color) return true;
			if (table[0][i] === color && table[1][i] === color && table[2][i] === color) return true;
		}

		// diagonal check
		if (table[0][0] === color && table[1][1] === color && table[2][2] === color) return true;
		if (table[0][2] === color && table[1][1] === color && table[2][0] === color) return true;

		return false;
	}

	getColor(msg) {
		const game = this.games.get(msg.channel.id);
		return game.choice % 2 === 0 ? '🇴' : '🇽';
	}

}

module.exports = TicTacToeCommand;
