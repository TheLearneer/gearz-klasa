/**
 * @file softban.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');
const ModLog = require('../../lib/ModLog');

class BanCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_SOFTBAN_DESCRIPTION'),
			requiredPermissions: ['BAN_MEMBERS'],
			usage: '<Member:member> [days:int{1,7}] [reason:string] [...]',
			usageDelim: ' '
		});
		this.userPermissions = ['BAN_MEMBERS'];
	}

	async run(msg, [member, days = 1, ...reason]) {
		if (member.id === msg.author.id) throw 'Why would you ban yourself ???';
		if (member.id === msg.author.id) throw 'Have I done something wrong ???';

		if (this.isBannable(msg, member)) {
			if (msg.guild.settings.moderation.confirmation) {
				const confirm = await this.askConfirmation(msg);
				if (!confirm) throw 'Terminated....';
			}
			reason = reason.length > 0 ? reason.join(' ') : null;

			await msg.guild.members.ban(member.user, { reason, days });
			await msg.guild.members.unban(member.user, 'Softban released.');

			new ModLog(msg.guild)
				.setAction('softban')
				.setUser(member.user)
				.setModerator(msg.author)
				.setReason(reason)
				.send();

			msg.send(`**${member.user.tag}** got soft banned.`);
		}
	}

	isBannable(message, member) {
		if (!this.bannable) throw 'I cannot kick this user.';
		if (member.roles.highest.position >= message.member.roles.highest.position) throw 'You cannot kick this user.';
		return true;
	}

}

module.exports = BanCommand;
