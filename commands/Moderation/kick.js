/**
 * @file kick.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const Command = require('../../lib/Structures/CommandBase/Moderation');
const ModLog = require('../../lib/ModLog');

class KickCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_KICK_DESCRIPTION'),
			requiredPermissions: ['KICK_MEMBERS'],
			usage: '<member:member> [reason:string] [...]',
			usageDelim: ' '
		});
		this.userPermissions = ['KICK_MEMBERS'];
	}

	async run(msg, [member, ...reason]) {
		if (member.id === msg.author.id) throw 'Why would you kick yourself ???';
		if (member.id === msg.author.id) throw 'Have I done something wrong ???';

		if (this.isKickable(msg, member)) {
			if (msg.guild.settings.moderation.confirmation) {
				const confirm = await this.askConfirmation(msg);
				if (!confirm) throw 'Terminated....';
			}
			reason = reason.length > 0 ? reason.join(' ') : null;

			await member.kick(reason);

			new ModLog(msg.guild)
				.setAction('kick')
				.setUser(member.user)
				.setModerator(msg.author)
				.setReason(reason)
				.send();

			msg.send(`**${member.user.tag}** is successfully kicked.`);
		}
	}

	isKickable(msg, member) {
		if (!member.kickable) throw 'I cannot kick this user.';
		if (member.roles.highest.position >= msg.member.roles.highest.position) throw 'You cannot kick this user.';
		return true;
	}

}

module.exports = KickCommand;
