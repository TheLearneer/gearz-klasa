/**
 * @file mafia.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');
const { Collection } = require('discord.js');
const { awaitPlayers, delay } = require('../../../lib/Util');
const { task } = require('../../../assets/data/mafia');

class MafiaCommand extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			description: language => language.get('COMMAND_MAFIA_DESCRIPTION')
		});
		this.games = new Collection();
	}

	async run(msg) {
		// Checking if another game is already being played in the channel, if not start a new game...
		if (this.games.has(msg.channel.id)) return msg.sendLocale('COMMAND_GAME_IN_PROGRESS', [this.name]);
		try {
			this.games.set(msg.channel.id);

			await msg.sendLocale('COMMAND_MAFIA_NEED_MORE');
			const awaitedPlayer = await awaitPlayers(msg, 3, 10);
			if (!awaitedPlayer) {
				this.games.delete(msg.channel.id);
				return msg.sendLocale('COMMAND_MAFIA_NOT_ENOUGH');
			}

			const players = await this.generatePlayers(awaitedPlayer);
			return await this.progressGame(msg, players);
		} catch (err) {
			this.games.delete(msg.channel.id);
			throw err;
		}
	}

	async progressGame(msg, players, night = 1) {
		if (players.size < 3) {
			const mafia = players.filter(plr => plr.role === 'mafia').first().user;
			return msg.channel.send(msg.language.get('COMMAND_MAFIA_CLEARED_CITY', `**${mafia.username}**`));
		}
		if (players.filter(player => player.role === 'mafia').size < 1) return msg.channel.send(msg.language.get('COMMAND_MAFIA_OVER'));

		// what happened this night...
		const thisNight = {
			killed: null,
			saved: null
		};

		msg.channel.send(`Night ${night}, sending DMs...`);
		for (const player of players.values()) {
			// No need to take input from citizens at this point.
			if (player.role === 'citizen') continue;
			await msg.channel.send(`**${player.role}** is making their decision.`);

			// getting valid players only.
			const validPlayers = this.getProgressedPlayers(players).filter(playr => playr.role !== player.role);
			const validListDisplay = validPlayers.map((plr, i) => `**${i + 1}.** ${plr.user.tag}`).join('\n');
			const roleQuestion = msg.language.get(`COMMAND_MAFIA_QUESTION_${player.role.toUpperCase()}`);
			player.user.send(msg.language.get('COMMAND_MAFIA_WHOIS_GUESS', validListDisplay, false, roleQuestion));

			const decision = await player.user.dmChannel.awaitMessages((res) => validPlayers[parseInt(res.content) - 1], {
				max: 1,
				time: 60000
			});
			if (!decision.size) {
				await player.user.send(msg.language.get('COMMAND_MAFIA_NO_DECISION'));
				continue;
			}

			const choice = parseInt(decision.first().content);
			const choosen = validPlayers[choice];
			if (player.role === 'mafia') {
				thisNight.killed = choosen.user.id;
			} else if (player.role === 'doctor') {
				thisNight.saved = choosen.user.id;
			} else {
				await player.user.send(choosen.role === 'mafia' ? 'Yes.' : 'No.');
			}
		}

		// Happenings next morning.
		const murdered = thisNight.killed ? players.get(thisNight.killed) : null;
		if (thisNight.killed && thisNight.killed !== thisNight.saved) {
			await msg.sendLocale('COMMAND_MAFIA_NIGHT_HAPPENING1', [murdered]);
			// User was attempted to kill, but doctor saved the user in right time.
		} else if (thisNight.killed && players.size < 3) {
			await msg.sendLocale('COMMAND_MAFIA_NIGHT_HAPPENING2', [murdered]);
			// only mafia and a single user are alive. the user left the village.
			return await this.progressGame(msg, players, night + 1);
		} else if (thisNight.killed && thisNight.killed !== thisNight.saved) {
			players.delete(thisNight.killed);
			await msg.sendLocale('COMMAND_MAFIA_NIGHT_HAPPENING3', [murdered]);
			// Mafia was successful in killing the user.
		} else {
			await msg.sendLocale('COMMAND_MAFIA_NIGHT_HAPPENING4');
			// Mafia came, but made no harm.
		}

		// Giving everyone 30 seconds to think
		await delay(30000);

		// asking for the vote to hang the user.
		const allPlayers = this.getProgressedPlayers(players);
		await msg.channel.send(msg.language.get('COMMAND_MAFIA_WHOIS_GUESS', allPlayers.map((plr, i) => `**${i + 1}.** ${plr.user.tag}`).join('\n'), true));

		// The filter for voting of mafia
		const voted = [];
		const filter = (res) => {
			if (!players.find(plr => plr.user.id === res.author.id)) return false;
			if (voted.includes(res.author.id)) return false;
			if (!allPlayers[parseInt(res.content) - 1]) return false;
			voted.push(res.author.id);
			return true;
		};

		// awaiting player's votes
		const votes = msg.channel.awaitMessages(filter, { max: players.size, time: 60000 });
		if (!votes.size) {
			msg.channel.send(msg.language.get('COMMAND_MAFIA_GET_HANGED'));
			return await this.progressGame(msg, players, night + 1);
		}
		const hanged = this.getVotes(votes, allPlayers);
		await msg.channel.send(msg.language.get('COMMAND_MAFIA_GET_HANGED', hanged.user.username));
		players.delete(hanged.user.id);
		return await this.progressGame(msg, players, night + 1);
	}

	getProgressedPlayers(players) {
		let i = 1;
		const returnObj = {};
		for (const player of players.values()) {
			returnObj[i] = {
				role: player.role,
				user: player.user
			};
			i++;
		}
		return returnObj;
	}

	async generatePlayers(players) {
		let roles = ['mafia', 'doctor', 'detective'];
		for (let i = 0; i < players.size - roles.length; i++) roles.push('citizen');
		roles = roles.shuffle();

		const list = new Collection();
		for (const user of players.values()) {
			const role = roles.shift();
			list.set(user.id, {
				user,
				role
			});
			const roleMsg = [`Your role will be: ${role}`];
			if (['mafia', 'doctor', 'detective'].includes(role)) roleMsg.push(`Your task is to ${task[role]}`);
			await user.send(roleMsg.join('\n'));
		}
		return list;
	}

	getVotes(votes, players) {
		const counts = new Collection();
		for (const vote of votes.values()) {
			const player = players[parseInt(vote.content) - 1];
			if (counts.has(player.user.id)) {
				++counts.get(player.user.id).votes;
			} else {
				counts.set(player.user.id, {
					votes: 1,
					user: player.user
				});
			}
		}
		return counts.sort((a, b) => b.votes - a.votes).first();
	}

}

module.exports = MafiaCommand;
