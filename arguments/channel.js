const { Argument, util: { regExpEsc } } = require('klasa');
const { Channel, Message } = require('discord.js');

const CHANNEL_REGEXP = Argument.regex.channel;

function resolveChannel(query, guild) {
	if (query instanceof Channel && query.type === 'text') return guild.channels.has(query.id) ? query : null;
	if (query instanceof Message) return query.guild.id === guild.id ? query.channel : null;
	if (typeof query === 'string' && CHANNEL_REGEXP.test(query)) {
		const ch = guild.channels.get(CHANNEL_REGEXP.exec(query)[1]);
		return ch.type === 'text' ? ch : null;
	}
	return null;
}

module.exports = class extends Argument {

	async run(arg, possible, msg) {
		if (!msg.guild) return this.channel(arg, possible, msg);
		const resChannel = resolveChannel(arg, msg.guild);
		if (resChannel) return resChannel;

		const results = [];
		const reg = new RegExp(regExpEsc(arg), 'i');
		for (const channel of msg.guild.channels.values()) {
			if (reg.test(channel.name)) results.push(channel);
		}

		let querySearch;
		if (results.length > 0) {
			const regWord = new RegExp(`\\b${regExpEsc(arg)}\\b`, 'i');
			const filtered = results.filter(channel => regWord.test(channel.name) && channel.type === 'text');
			querySearch = filtered.length > 0 ? filtered : results;
		} else {
			querySearch = results;
		}

		switch (querySearch.length) {
			case 0: throw `${possible.name} Must be a valid name, id or channel mention`;
			case 1: return querySearch[0];
			default: throw `Found multiple matches: \`${querySearch.map(channel => channel.name).join('`, `')}\``;
		}
	}

};
