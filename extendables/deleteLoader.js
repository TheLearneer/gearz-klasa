const { Extendable } = require('klasa');

class deleteLoaderExtender extends Extendable {

	constructor(...args) {
		super(...args, {
			appliesTo: ['KlasaMessage'],
			klasa: true
		});
	}

	async extend() {
		return this.loader ? await this.loader.delete() : null;
	}

}

module.exports = deleteLoaderExtender;
