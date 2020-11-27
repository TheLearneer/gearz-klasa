/**
 * @file ban.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const Command = require('../../lib/Structures/CommandBase/Moderation');
const ModLog = require('../../lib/ModLog');

class BanCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_BAN_DESCRIPTION'),
			requiredPermissions: ['BAN_MEMBERS'],
			usage: '<user:user> [days:int{1,7}] [reason:string] [...]',
			usageDelim: ' '
		});
		this.userPermissions = ['BAN_MEMBERS'];
	}

	async run(msg, [user, days = 0, ...reason]) {
		const member = await msg.guild.members.fetch(user).catch(() => null);

		if (member.id === msg.author.id) throw 'Why would you ban yourself ???';
		if (member.id === this.client.user.id) throw 'Have I done something wrong ???';

		if (this.isBannable(msg, member)) {
			if (msg.guild.settings.moderation.confirmation) {
				const confirm = await this.askConfirmation(msg);
				if (!confirm) throw 'Terminated....';
			}
			reason = reason.length > 0 ? reason.join(' ') : null;

			await msg.guild.members.ban(user, { reason, days });

			await new ModLog(msg.guild)
				.setAction('ban')
				.setUser(user)
				.setModerator(msg.author)
				.setReason(reason)
				.send();

			msg.send(`**${user.tag}** is successfully banned.`);
		}
	}

	isBannable(msg, member) {
		if (!this.bannable) throw 'I cannot ban this user.';
		if (member.roles.highest.position >= msg.member.roles.highest.position) throw 'You cannot kick this user.';
		return true;
	}

}

module.exports = BanCommand;
