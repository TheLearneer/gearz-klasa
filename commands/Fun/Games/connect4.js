/**
 * @file Connect4.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');
const { Collection } = require('discord.js');
const { verifyYesNo } = require('../../../lib/Util');
const { emotes } = require('../../../lib/Structures/emotes');

class Connect4GameCommand extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_CONNECT4_DESCRIPTION'),
			usage: '<Opponent:member>',
			aliases: ['c4']
		});
		this.customizeResponse('Opponent', language => language.get('COMMAND_MUST_MENTION_TO_PLAY'));

		this.games = new Collection();
		this.numbers = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣'];
	}

	async run(message, [member]) {
		// Checking if another game is already being played in the channel.
		if (this.games.has(message.channel.id)) return message.sendLocale('COMMAND_GAME_IN_PROGRESS', [this.name]);

		// Checking if challenged a valid user.
		if (member.user.bot) return message.sendLocale('COMMAND_BOTS_CANNOT_PLAY');
		if (member === message.member) return message.sendLocale('COMMAND_CANNOT_PLAY_ONESELF');

		// asking the mentioned user if he/she really want to play
		const msg = await message.sendLocale('COMMAND_CHALLENGED_FOR_GAME', [`**${this.name}**`, member.user.tag, `**${message.author.username}**`]);
		const challengeAccepted = await verifyYesNo(message.channel, member.user, 15000);

		// The user declined to play so terminating the command hereby with a message.
		if (!challengeAccepted) return message.sendLocale('COMMAND_DECLINED_TO_PLAY', [`**${member.user.username}**`, message.author]);

		try {
			// starting a game because the challeng is accepted !!!
			this.games.set(message.channel.id, {
				players: [message.author, member.user],
				choice: 0,
				table: new Array(6).fill(new Array(7).fill(emotes.c4Empty))
			});

			// Initializing some aspects of game
			await this.startGame(msg);
			// Handling the entire process of game
			return await this.handleProgress(msg);
		} catch (err) {
			this.games.delete(msg.channel.id);
			throw err;
		}
	}

	async handleProgress(msg) {
		// The basic declarations
		const thisGame = this.games.get(msg.channel.id);
		const currentUser = thisGame.players[thisGame.choice % 2];

		// getting the table for the current TURN.
		await msg.edit(this.getTurnTable(msg));

		// awaiting reaction from the user who turn it is.
		try {
			// letting the user to react with available reactions.
			const reactions = await msg.awaitReactions((rec, user) => user === currentUser && this.numbers.includes(rec.emoji.toString()), { time: 60000, max: 1, errors: ['time'] });
			// the emoji user reacted with
			const reacted = reactions.first();
			// getting the column user choose and hangling things for possible|not possible.
			const column = this.numbers.indexOf(reacted._emoji.name);

			// if the column is full
			if (!this.checkColumnPossible(msg, column)) {
				msg.channel.send(msg.language.get('COMMAND_CONNECT4_COLUMN_FULL', currentUser, column + 1)).then(sent => {
					sent.delete({ timeout: 5000 });
				});
				reacted.users.remove(currentUser).catch(() => null);
				return this.handleProgress(msg);
			}

			// if the selected column is available for updating the table.
			this.updateTable(msg, currentUser, column);

			// Checking if someone won the game.
			const gameWon = this.checkWin(msg, currentUser);
			if (gameWon) {
				this.games.delete(msg.channel.id);
				msg.reactions.removeAll().catch(() => null);
				return await msg.edit(msg.language.get('COMMAND_GAME_WIN', `**${currentUser.username}**`, this.getTable(msg)));
			}

			// Checking if the game ended with a DRAW.
			const gameDraw = this.checkDraw(msg);
			if (gameDraw) {
				this.games.delete(msg.channel.id);
				msg.reactions.removeAll().catch(() => null);
				return await msg.edit(msg.language.get('COMMAND_GAME_DRAW', this.getTable(msg)));
			}

			// Handling the game for the turn of next user.
			thisGame.choice += 1;
			reacted.users.remove(currentUser).catch(() => null);
			return this.handleProgress(msg);
		} catch (error) {
			this.games.delete(msg.channel.id);
			await msg.reactions.removeAll().catch(() => null);
			thisGame.choice += 1;
			const winner = thisGame.players[thisGame.choice % 2];
			return msg.edit(msg.language.get('COMMAND_INACTIVE_WIN', `**${winner.username}**`, this.getTable(msg)));
		}
	}

	async startGame(msg) {
		msg.edit('`Loading, Please wait ...`');
		for (let i = 0; i < this.numbers.length; i++) await msg.react(this.numbers[i]);
	}

	// get the table as wall of text.
	getTable(msg) {
		const thisGame = this.games.get(msg.channel.id);
		const output = [
			thisGame.table.map(ar => ar.join('')).join('\n'),
			'-------------------------------',
			this.numbers.join('')
		].join('\n');
		return output;
	}

	// the table self-produced for every turn
	getTurnTable(msg) {
		const thisGame = this.games.get(msg.channel.id);
		const currentUser = thisGame.players[thisGame.choice % 2];
		return [
			msg.language.get('COMMAND_CONNECT4_TURN_OF', currentUser),
			this.getTable(msg)
		].join('\n\n');
	}

	// checking if the column user selected is available.
	checkColumnPossible(msg, num) {
		const thisGame = this.games.get(msg.channel.id);
		for (let i = thisGame.table.length - 1; i >= 0; i--) {
			if (thisGame.table[i][num] === emotes.c4Empty) return true;
		}
		return false;
	}

	// updating the table for the position user selected.
	updateTable(msg, user, num) {
		const thisGame = this.games.get(msg.channel.id);
		const color = this.getUserColor(msg, user);
		for (let i = thisGame.table.length - 1; i >= 0; i--) {
			if (thisGame.table[i][num] === emotes.c4Empty) {
				thisGame.table[i][num] = color;
				return;
			}
		}
	}

	// getting the color for the user.
	getUserColor(msg, user) {
		const thisGame = this.games.get(msg.channel.id);
		const pos = thisGame.players.indexOf(user);
		return pos % 2 === 0 ? emotes.c4Blue : emotes.c4Red;
	}

	// checking if someone won the game
	checkWin(msg, user) { // eslint-disable-line complexity
		const thisGame = this.games.get(msg.channel.id);
		const { table } = thisGame;
		const playerColor = this.getUserColor(msg, user);
		const winCol = playerColor === emotes.c4Blue ? emotes.c4BlueWin : emotes.c4RedWin;

		// horizontal check
		for (let i = 0; i < 6; i++) {
			for (let j = 0; j < 4; j++) {
				const row = table[i];
				if (row[j] === playerColor && row[j + 1] === playerColor && row[j + 2] === playerColor && row[j + 3] === playerColor) {
					for (let k = 0; k < 4; k++) {
						table[i][j + k] = winCol;
					}
					return true;
				}
			}
		}
		// vertical check
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 7; j++) {
				if (table[i][j] === playerColor && table[i + 1][j] === playerColor && table[i + 2][j] === playerColor && table[i + 3][j] === playerColor) {
					for (let k = 0; k < 4; k++) {
						table[i + 0][j] = winCol;
					}
					return true;
				}
			}
		}
		// right diagonal check
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 4; j++) {
				if (table[i][j] === playerColor && table[i + 1][j + 1] === playerColor && table[i + 2][j + 2] === playerColor && table[i + 3][j + 3] === playerColor) {
					for (let k = 0; k < 4; k++) {
						table[i + k][j + k] = winCol;
					}
					return true;
				}
			}
		}
		// left diagonal check
		for (let i = 0; i < 3; i++) {
			for (let j = 3; j < 7; j++) {
				if (table[i][j] === playerColor && table[i + 1][j - 1] === playerColor && table[i + 2][j - 2] === playerColor && table[i + 3][j - 3] === playerColor) {
					for (let k = 0; k < 4; k++) {
						table[i + k][j - k] = winCol;
					}
					return true;
				}
			}
		}
		return false;
	}

	checkDraw(msg) {
		const thisGame = this.games.get(msg.channel.id);
		for (let i = 0; i < thisGame.table[0].length; i++) {
			for (let j = 0; j < thisGame.table.length; j++) {
				if (thisGame.table[i][j] === emotes.c4Empty) return false;
			}
		}
		return true;
	}

}

module.exports = Connect4GameCommand;
