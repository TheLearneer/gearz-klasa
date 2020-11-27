const { Finalizer } = require('klasa');

module.exports = class extends Finalizer {

	constructor(...args) {
		super(...args, { enabled: true });
	}

	async run(msg) {
		if (msg.loader) await msg.deleteLoader();
	}

};
