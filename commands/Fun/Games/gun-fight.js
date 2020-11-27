/**
 * @file best_guess.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');
const { Collection } = require('discord.js');
const { verifyYesNo, delay, randomInt } = require('../../../lib/Util');

class GunFightCommand extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: language => language.get('COMMAND_GUN_FIGHT_DESCRIPTION'),
			usage: '<Opponent:member>'
		});
		this.games = new Collection();
		this.words = ['shoot', 'fire'];
	}

	async run(msg, [member]) {
		// Checking if another game is already being played in the channel.
		if (this.games.has(msg.channel.id)) return msg.sendLocale('COMMAND_GAME_IN_PROGRESS', [this.name]);

		// Checking if challenged a valid user.
		if (member.bot) return msg.sendLocale('COMMAND_GUNFIGHT_NO_BOT_FIGHT');
		if (member === msg.member) return msg.sendLocale('COMMAND_GUNFIGHT_NO_SELF_FIGHT');

		// asking the mentioned user if he/she really want to play
		const message = await message.sendLocale('COMMAND_CHALLENGED_FOR_GAME', [`**${this.name}**`, member.user.tag, `**${message.author.username}**`]);
		const challengeAccepted = await verifyYesNo(message.channel, member.user, 15000);

		// The user declined to play so terminating the command hereby with a message.
		if (!challengeAccepted) return message.sendLocale('COMMAND_DECLINED_TO_PLAY', [`**${member.user.username}**`, message.author]);
		// The user accepted, so time to start the gun fight
		this.games.set(msg.channel.id, true);

		try {
			// Starting the gun-fight
			await msg.sendLocale('COMMAND_GUNFIGHT_GET_READY');
			await delay(randomInt(2000, 15000));
			const word = this.words.random();
			await msg.send(`TYPE **\`${word.toUpperCase()}\`** NOW!`);

			const winner = await msg.channel.awaitMessages((res) => [member.id, msg.author.id].includes(res.author.id) && res.content.toLowerCase() === word, {
				max: 1,
				time: 30000
			});

			this.games.delete(msg.channel.id);
			if (!winner.size) return msg.sendLocale('COMMAND_GUNFIGHT_DRAW');
			return msg.sendLocale('COMMAND_GUNFIGHT_VICTORY', winner.first().author.username);
		} catch (err) {
			this.games.delete(msg.channel.id);
			throw err;
		}
	}

}

module.exports = GunFightCommand;
