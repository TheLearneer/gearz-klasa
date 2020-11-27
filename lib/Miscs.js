const { MessageEmbed } = require('discord.js');
const request = require('./Request');
const { version } = require('../package.json');

/**
 * Some misc functions made for code-duplicaiton reduction.
 */
class Miscs {

	/**
	 * Constructs the Miscs class.
	 * @param {Client} client The discord.js client instance.
	 * @since 3.0.0
	 */
	constructor(client) {
		this.client = client;
	}

	/**
	 * Custom Embed for the client which looks cool.
	 * @param {Object} [options={}] Custom embed options.
	 * @param {boolean} [options.footer=true] whether to add footer or not.
	 * @param {string} [options.text] custom text to add to footer.
	 * @returns {MessageEmbed} The embed ready to be used directly or further modified as per need.
	 */
	getEmbed(options = {}) {
		if (typeof options !== 'object') throw 'Error in generating Embed... please contact the developer.';
		if (!options.hasOwnProperty('footer')) options.footer = true;
		if (options.text && typeof options.text !== 'string') throw 'Text must be string.';

		const embed = new MessageEmbed().setColor('#36393E');
		if (options.footer === true) embed.setFooter(`© ${this.client.user.username} 2018${options.text ? ` | ${options.text}` : ''}`);
		return embed;
	}

	/**
	 * Custom request method expanded from request.get with user-agent setup.
	 * @async
	 * @param {string} URL The URL to be requested.
	 * @param {string} method The method to call on the API. Can be get, post or whatever Request supports.
	 * @returns {Request} Request result.
	 */
	request(URL, method = 'get') {
		return request[method](URL).set('User-Agent', `[Discord BOT] (${this.client.user.username}-v${version}) - Author: Santosh Bhandari (Santosh#2138) - Website: https://gearzbot.me`);
	}

}

module.exports = Miscs;
