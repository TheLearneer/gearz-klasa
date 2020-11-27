const { Route } = require('klasa-dashboard-hooks');
const { keys } = require('../config');

class DblUpvoteRoute extends Route {

	constructor(...args) {
		super(...args, { route: 'upvote/dbl' });
	}

	async post(req, res) {
		// doing some early confirmation checks to avoid false call to the route.
		if (req.headers['content-type'] !== 'application/json') return this.end(res, 415);
		if (req.headers['user-agent'] !== 'DBL') return this.end(res, 400);
		if (req.headers.authorization !== keys.dblUpvoteConfirmation) return res.json({ error: 'Stop trying to fake upvote...' });

		// getting the upvote and user object...
		const upvote = req.body;
		const user = await this.client.users.fetch(upvote.user);

		// adding the user to the upvoter list in the client settings.
		const { settings } = this.client;
		if (!settings.upvoters.filter(voter => voter === user.id).length) settings.update('upvoters', user.id);

		// providing the upvoter role if the user is in the support server...
		// TO-BE-DONE Add Gearz-Guild ID.
		const providedRoleRaw = await this.client.shard.broadcastEval(`
			const guild = this.guilds.get('Gearz-guild');
			if (!guild) return null;
			const member = guild.members.fetch('${user.id}');
			if (!member) return null;
			member.roles.add('Upvote-role-id')
				.then(() => true)
				.catch(() => null);
		`);
		const isProvided = providedRoleRaw.filter(provided => provided === true).length;

		// logging the upvote...
		await this.client.helper.Logger.logDblUpvote(user, isProvided, 'Discordbots.org');

		// ending the webhook call successfully.
		return this.end(res, 200);
	}

	end(res, code) {
		res.writeHead(code);
		res.end();
	}

}

module.exports = DblUpvoteRoute;
