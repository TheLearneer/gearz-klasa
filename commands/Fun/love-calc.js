/**
 * @file love-calc.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class LoveCalcCommand extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_LOVECALC_DESCRIPTION'),
			usage: '<Crush:member|Name:string>',
			aliases: ['love-meter'],
			runIn: ['text']
		});
	}

	async run(msg, [member]) {
		if (member === msg.member || member === msg.member.displayName) return msg.sendLocale('COMMAND_LOVECALC_LOVE_SELF');
		member = typeof member === 'string' ? member : member.displayName;

		const loveResult = await this.client.helper.Api.calculateLove(msg.member.displayName, member);

		const embed = this.client.helper.Miscs.getEmbed({ footer: false })
			.setThumbnail('http://images6.fanpop.com/image/answers/3317000/3317487_1375024940496.53res_300_202.jpg')
			.addField('Lover', loveResult.fname)
			.addField('Crush', loveResult.sname)
			.addField('Love Percent', loveResult.percentage)
			.setFooter(loveResult.result);
		return msg.sendEmbed(embed);
	}

}

module.exports = LoveCalcCommand;
