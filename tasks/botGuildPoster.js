const { Task } = require('klasa');
const { keys, config } = require('../config');

class BotGuildPoster extends Task {

	async run() {
		if (this.client.user.id !== '367202192609902593' || !config.postStatsToLists) return;
		const stats = { server_count: this.client.guilds.size, shard_id: this.client.shard.id, shard_count: this.client.shard.count }; // eslint-disable-line camelcase
		const allGuilds = await this.client.shard.fetchClientValues('guilds.size');

		await this.postRequest(`https://discordbots.org/api/bots/${this.client.user.id}/stats`).send(stats)
			.set('Authorization', keys.DBLToken)
			.then(() => console.log('Succuessfully updated the stats on https://discordbots.org'))
			.catch((err) => console.error(`Oops something went wrong while updating stats on https://discordbots.org ${err.message}`));

		await this.postRequest(`https://bots.discord.pw/api/bots/${this.client.user.id}/stats`).send(stats)
			.set('Authorization', keys.DBPWToken)
			.then(() => console.log('Succuessfully updated the stats on https://bots.discord.pw'))
			.catch((err) => console.error(`Oops something went wrong while updating stats on https://bots.discord.pw ${err.message}`));

		await this.postRequest(`https://botsfordiscord.com/api/v1/bots/${this.client.user.id}`)
			.send({ server_count: allGuilds.reduce((prev, val) => prev + val, 0) }) // eslint-disable-line camelcase
			.set('Authorization', keys.B4DToken)
			.then(() => console.log('Succuessfully updated the stats on https://botsfordiscord.com'))
			.catch((err) => console.error(`Oops something went wrong while updating stats on https://botsfordiscord.com ${err.message}`));

		await this.postRequest(`https://listcord.com/api/bot/${this.client.user.id}/guilds`)
			.send({ guilds: this.client.guilds.size, shard: this.client.shard.id })
			.set('token', keys.ListcordToken)
			.then(() => console.log('Succuessfully updated the stats on https://listcord.com'))
			.catch((err) => console.error(`Oops something went wrong while updating stats on https://listcord.com ${err.message}`));
	}

	postRequest(url) {
		return this.client.helper.Miscs.request(url, 'post');
	}

}

module.exports = BotGuildPoster;
