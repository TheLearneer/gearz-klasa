const { Piece } = require('klasa');

class RawEvent extends Piece {

	constructor(...args) {
		super(...args, { enabled: true });
	}

	run() {
		// Defined in extension Classes
	}

}

module.exports = RawEvent;
