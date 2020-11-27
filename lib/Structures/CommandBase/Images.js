const { Command } = require('klasa');
const { User } = require('discord.js');

class ImageCommand extends Command {

	constructor(...args) {
		super(...args, { cooldown: 15 });
	}

	/**
	 * Get avatar for a raw user input.
	 * @since 4.0.0
	 * @param {string} user user which is to be verified and fetched.
	 * @param {string} options The options for the user avatar.
	 * @param {string} options.format The format of the avatar to be fetched.
	 * @param {number} options.size The size of the avatat to be fetched.
	 * @returns {URL} The Avatar URL of the verified user.
	 */
	getUserAvatar(user, options = { format: 'png', size: 128 }) {
		if (typeof options !== 'object') throw 'Request options must be an object';
		if (!options.hasOwnProperty('format')) options.format = 'png';
		if (!options.hasOwnProperty('size')) options.size = 128;
		return user.displayAvatarURL({ format: options.format, size: options.size });
	}

	/**
	 * Get avatar for a d.js user instance.
	 * @since 4.0.0
	 * @param {*} user User whose avatar is to be fetched.
	 * @param {*} options The options for the user avatar.
	 * @param {string} options.format The format of the avatar to be fetched.
	 * @param {number} options.size The size of the avatat to be fetched.
	 * @returns {URL} The Avatar URL of the verified user.
	 */
	getImage(user, options) {
		if (user instanceof User) return this.getUserAvatar(user, options);
		else return user;
	}

}

module.exports = ImageCommand;
