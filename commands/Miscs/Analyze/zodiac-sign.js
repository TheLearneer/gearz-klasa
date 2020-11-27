/**
 * @file zodiac-sign.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class ZodiacSignCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_ZODIAC_SIGN_DESCRIPTION'),
			usage: '<Month:Int{1,12}> <Day:Int{1,31}>'
		});
	}

	async run(msg, [month, day]) {
		const sign = this.determineSign(month, day);
		if (!sign) return msg.sendLocale('COMMAND_ZODIAC_SIGN_INVALID_DATE');
		return msg.sendLocale('COMMAND_ZODIAC_SIGN_SIGN', [month, day, sign]);
	}

	determineSign(month, day) { // eslint-disable-line complexity
		switch (month) {
			case 1: return day <= 19 ? 'Capricorn' : day <= 31 ? 'Aquarius' : null;
			case 2: return day <= 18 ? 'Aquarius' : day <= 29 ? 'Pisces' : null;
			case 3: return day <= 20 ? 'Pisces' : day <= 31 ? 'Aries' : null;
			case 4: return day <= 19 ? 'Aries' : day <= 31 ? 'Taurus' : null;
			case 5: return day <= 20 ? 'Taurus' : day <= 31 ? 'Gemini' : null;
			case 6: return day <= 20 ? 'Gemini' : day <= 31 ? 'Cancer' : null;
			case 7: return day <= 22 ? 'Cancer' : day <= 31 ? 'Leo' : null;
			case 8: return day <= 22 ? 'Leo' : day <= 31 ? 'Virgo' : null;
			case 9: return day <= 22 ? 'Virgo' : day <= 31 ? 'Libra' : null;
			case 10: return day <= 22 ? 'Libra' : day <= 31 ? 'Scorpio' : null;
			case 11: return day <= 21 ? 'Scorpio' : day <= 31 ? 'Sagittarius' : null;
			case 12: return day <= 21 ? 'Sagittarius' : day <= 31 ? 'Capricorn' : null;
			default: return null;
		}
	}

}

module.exports = ZodiacSignCommand;
