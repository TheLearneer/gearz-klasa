const { Task } = require('klasa');

class UpvoteWebhookHandler extends Task {

	async run() {
		// resetting the upvoters counts for DBL every 24 hours
		await this.client.settings.reset('upvoters');
	}

}

module.exports = UpvoteWebhookHandler;
