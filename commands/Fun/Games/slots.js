/**
 * @file Slots.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class SlotsCommand extends Command {

	constructor(...args) {
		super(...args, {
			enabled: false,
			description: language => language.get('COMMAND_SLOTS_DESCRIPTION'),
			usage: '<Amount:Integer{5,50}>'
		});
		this.hidden = true;
	}

	async run(msg, [bet]) {
		const { settings: { economy: { coins } } } = msg.author;
		// Bet is bet, you need to have enough amount...
		if (coins < bet) throw `You dont have enought amount to bet.\nCurrently you have: ${coins}`;

		await msg.send(`${bet} coins has been deducted as the bet amount from your account. Slots result should be out soon...`);
		// Slots is ran, and the result is here... just need to do further processing now.
		const { slotDisplay, coinChange } = this.drawSlots(bet);

		if (coinChange === 0) {
			msg.send(`${slotDisplay}\nYou got the Joker only match. Your bet amount got refunded to your account.`);
		} else {
			if (coinChange < 0) msg.send(`${slotDisplay}\nThe slots didn't spin in your favor. You lost the bet amount of ${bet}`);
			else msg.send(`${slotDisplay}\nWohooo, you won ${coinChange} coins.`);
			await this.awardCoins(msg.author, coinChange);
		}
	}

	async awardCoins(user, coins) {
		const currentCoins = user.settings.economy.coins;
		await user.settings.update('economy.coins', currentCoins + coins);
	}

	drawSlots(betAmount) {
		const slotItems = [
			{ id: 'jokers', occurance: 1, reward: 1 },
			{ id: 'orange', occurance: 1, reward: 4 },
			{ id: 'apples', occurance: 1, reward: 4 },
			{ id: 'banana', occurance: 2, reward: 4 },
			{ id: 'grapes', occurance: 2, reward: 8 },
			{ id: 'cherry', occurance: 2, reward: 8 },
			{ id: 'moneys', occurance: 4, reward: 10 },
			{ id: 'hearts', occurance: 5, reward: 12 },
			{ id: 'jacpot', occurance: 8, reward: 20 }
		];

		const newSLots = [[], [], []];
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				let occurance = Math.floor(Math.random() * 10);
				occurance = occurance < 1 ? 1 : occurance;
				newSLots[i][j] = slotItems.filter(item => item.occurance <= occurance).random();
			}
		}

		const slotResult = this.checkGame(newSLots);
		const display = this.displaySlots(newSLots, slotResult);

		let coinAddition = 0;
		if (!slotResult.won) coinAddition -= betAmount;
		if (slotResult.multiplier > 1) coinAddition += betAmount * slotResult.multiplier;

		return { display, coinChange: coinAddition };
	}

	checkGame(slots) {
		const result = {
			row1: { victory: false, id: null },
			row2: { victory: false, id: null },
			row3: { victory: false, id: null },
			diagonal1: { victory: false, id: null },
			diagonal2: { victory: false, id: null },
			multiplier: 0,
			won: false
		};

		// row check
		for (let i = 0; i < 3; i++) {
			const forValid = slots[i][0].id !== 'jokers' ? slots[i][0] : slots[i][1].id !== 'jokers' ? slots[i][1] : slots[i][2];
			const valids = [forValid.id, 'jokers'];
			if (valids.includes(slots[i][0].id) && valids.includes(slots[i][1].id) && valids.includes(slots[i][2].id)) {
				result[`row${i + 1}`] = {
					victory: true,
					id: forValid.id
				};
				result.multiplier += forValid.reward;
			}
		}

		// diagonal check
		const diagonalValid1 = slots[0][0].id !== 'jokers' ? slots[0][0] : slots[1][1].id !== 'jokers' ? slots[1][1] : slots[2][2];
		const diagonalValid2 = slots[0][2].id !== 'jokers' ? slots[0][2] : slots[1][1].id !== 'jokers' ? slots[1][1] : slots[2][0];
		const valids1 = [diagonalValid1.id, 'jokers'];
		const valids2 = [diagonalValid2.id, 'jokers'];

		if (valids1.includes(slots[0][0].id) && valids1.includes(slots[1][1].id) && valids1.includes(slots[2][2].id)) {
			result.diagonal1 = {
				victory: true,
				id: diagonalValid1.id
			};
			result.multiplier += diagonalValid1.reward;
		}

		if (valids2.includes(slots[0][2].id) && valids2.includes(slots[1][1].id) && valids2.includes(slots[2][0].id)) {
			result.diagonal2 = {
				victory: true,
				id: diagonalValid2.id
			};
			result.multiplier += diagonalValid2.reward;
		}

		if (result.multiplier >= 1) result.won = true;
		return result;
	}

	displaySlots(slots, victory) {
		const output = [];
		const midway = slots.map(row => row.map(itm => itm.id).join(' | '));
		output.push(`${victory.diagonal1.victory ? '↘' : '⬛'} 💲 💲 💲 ${victory.diagonal2.victory ? '↙' : '⬛'}`);
		for (let i = 0; i < 3; i++) {
			output.push(`${victory[`row${i + 1}`].victory ? '➡' : '⬛'} ${midway[i]} ${victory[`row${i + 1}`].victory ? '⬅' : '⬛'}`);
		}
		output.push(`${victory.diagonal2.victory ? '↗' : '⬛'} 💲 💲 💲 ${victory.diagonal1.victory ? '↖' : '⬛'}`);
		return output.join('\n');
	}

}

module.exports = SlotsCommand;
