const { Inhibitor } = require('klasa');

class ServerSpecificCommandInhibitor extends Inhibitor {

	async run(msg, cmd) {
		if (!cmd.servers) return false;
		if (typeof cmd.servers === 'string' && msg.guild.id !== cmd.servers) return true;
		else if (!cmd.servers.includes(msg.guild.id)) return true;
		return false;
	}

}

module.exports = ServerSpecificCommandInhibitor;
