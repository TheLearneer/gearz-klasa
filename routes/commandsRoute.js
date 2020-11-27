const { Route } = require('klasa-dashboard-hooks');

class CommandsRoute extends Route {

	constructor(...args) {
		super(...args, { route: 'commands' });
	}

	async get(req, res) {
		return res.end(JSON.stringify(this.client.commands));
	}

}

module.exports = CommandsRoute;
