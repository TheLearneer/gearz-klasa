const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(message, command) { // eslint-disable-line consistent-return
		if (command.userPermissions && !message.member.hasPermission(command.userPermissions)) return true;
	}

};
