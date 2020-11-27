const { Command } = require('klasa');

class FactCommand extends Command {

	constructor(...args) {
		super(...args, {
			description: '',
			usage: '[cat|dog]'
		});
	}

	async run(msg, [base]) {
		if (!base) base = ['cat', 'dog'].random();
		return await msg.send(await this.getFact(base));
	}

	async getFact(base) {
		let fact;
		let result;

		switch (base.toLowerCase()) {
			// Getting cat facts
			case 'cat':
				result = await this.client.helper.API.getCatfact();
				fact = `😼 | **Did you know ??** ${result}`;
				break;

			// getting dog facts
			case 'dog':
				result = this.client.helper.API.getDogFact();
				if (!result.success) fact = 'Oops there was some error. Try again in a while. _If the error exists, contact the devs as soon as possible._';
				else fact = `🐶 | **Did you know ??** ${result.facts[0]}`;
				break;
		}
		return fact;
	}

}

module.exports = FactCommand;
