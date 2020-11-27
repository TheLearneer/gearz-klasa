const { Monitor } = require('klasa');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			ignoreOthers: false,
			ignoreEdits: false,
			ignoreBlacklistedUsers: false
		});
	}

	run(msg) {
		if (!msg.guild) return null;

		const { settings: { autoMod: { antiInvite } } } = msg.guild;
		if (!antiInvite.enabled) return null;
		if (antiInvite.ignoreChannels.includes(msg.channel.id)) return null;

		if (msg.member.hasPermission(['MANAGE_GUILD'], false, true)) return null;

		const inviteRegex = /(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i;
		if (inviteRegex.test(msg.content)) {
			const link = inviteRegex.exec(msg.content)[0];
			// not doing anything if the link is added in the whitelisted links
			if (antiInvite.whitelisted.includes(link)) return null;
			this.client.fetchInvite(link)
				.then(inv => {
					if (inv.guild.id === msg.guild.id) return null;
					msg.delete()
						.then(() => msg.sendLocale('MONITOR_ANTI_INVITE_NOT_ALLOWED', [`**${msg.author.tag}**`]))
						.catch(err => this.client.emit('log', err, 'error'));
					return null;
				})
				.catch(() => {
					if (/(discord\.(io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(msg.content)) {
						msg.delete()
							.then(() => msg.sendLocale('MONITOR_ANTI_INVITE_NOT_ALLOWED', [`**${msg.author.tag}**`]))
							.catch(err => this.client.emit('log', err, 'error'));
					}
					return null;
				});
		}
		return null;
	}

};
