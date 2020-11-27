const { Command } = require('klasa');
const { verifyYesNo } = require('../../lib/Util');

class NotifyCommand extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: 'Notify the certain user base',
			usage: '[Channel:TextChannel] <subscribers|translators> <Message:String>',
			permissionLevel: 10
		});
	}

	async run(msg, [channel = '', base, message]) {
		const role = msg.guild.roles.get(this.getRoleID(base));

		await msg.send(`Are you sure want to send the message below to the channel: ${channel} mentioning ${role.name} role ??\n\`\`\`${message}\`\`\``);
		const confirmation = verifyYesNo(msg.channel, msg.author);
		if (!confirmation) return msg.send('Notification cancelled.');

		// If the role exists, making it mentionable, sending the message in the specified channel, and finally making the role unmentionable
		if (role) await role.edit({ mentionable: true });
		await channel.send(message);
		if (role) await role.edit({ mentionable: false });
		return msg.send('Notified...');
	}

	getRoleID(role) {
		role = role.toLowerCase();
		if (role === 'subscribers') return '358107764603486209';
		else if (role === 'translators') return '';
		else return 'IDIOT';
	}

}

module.exports = NotifyCommand;
