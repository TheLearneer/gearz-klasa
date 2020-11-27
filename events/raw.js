const { Event } = require('klasa');
const { Constants: { Events } } = require('discord.js');

class RawEvent extends Event {

	async run(packet) {
		const _event = this.client.rawEvents.get(Events[packet.t]);
		if (_event && _event.enabled) _event.run(packet.d);
	}

}

module.exports = RawEvent;

/*
 * The packet parameter of the raw event is such object
 * packet.t: Event Triggered i.e. 'MESSAGE_UPDATE' etc
 * packet.s: Integer number, seems like the amount of events triggered
 * packet.op: Integer number, completely unknown what it is.
 * packet.d: The data for the event.
 */
