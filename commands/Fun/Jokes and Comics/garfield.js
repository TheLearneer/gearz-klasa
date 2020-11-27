/**
 * @file garfield.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');
const { getRandomDate } = require('../../../lib/Util');
const { emotes } = require('../../../lib/Structures/emotes');

class GarfieldCommand extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_GARFIELD_DESCRIPTION'),
			usage: '[Today:Boolean]'
		});
	}

	async run(msg, [today = false]) {
		const comicDate = today ? new Date() : getRandomDate(267062400000);
		const { year, month, date } = this.parseDate(comicDate);

		const embed = this.client.helper.Miscs.getEmbed()
			.setTitle(`${emotes.garfield} Garfield comic: ${year}/${month}/${date}`)
			.setImage(`https://d1ejxu6vysztl5.cloudfront.net/comics/garfield/${year}/${year}-${month}-${date}.gif`)
			.setTimestamp();
		return await msg.sendEmbed(embed);
	}

	parseDate(comicDate) {
		const year = comicDate.getUTCFullYear();
		let month = comicDate.getUTCMonth() + 1;
		let date = comicDate.getUTCDate();

		if (month < 10) month = `0${month}`;
		if (date < 10) date = `0${date}`;

		return { year, month, date };
	}

}

module.exports = GarfieldCommand;
