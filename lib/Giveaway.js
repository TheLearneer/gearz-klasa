/**
 * @file Giveaway.js
 * @author Santosh Bhandari (a.k.a Froosty)
 * @license MIT
 */

const { ScheduledTask } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { getDuration } = require('./Util');

/*
 * The getEmbed might display wrong duration,
 * TO-BE-DONE fix it ^
 */

class Giveaway {

	constructor() {
		// The unique ID for this particular giveaway
		this.id = null;

		// Various properties of this giveaway... used for creating, updating and ending the giveaway.
		this.guild = null;
		this.channel = null;
		this.message = null;

		this.duration = null;
		this.prize = null;

		this.winnerCount = 1;
		this.users = [];
		this.winners = [];

		this.startTimestamp = null;
		this.endTimestamp = null;
	}

	/**
	 * Set the prize for this giveaway
	 * @chainable
	 * @since 4.0.0
	 * @param {string} prize The prize of the giveaway
	 * @returns {Giveaway}
	 */
	setPrize(prize) {
		this.prize = prize;
		return this;
	}

	/**
	 * Set the amount of possible winners for this giveaway.
	 * @chainable
	 * @since 4.0.0
	 * @param {integer} count Possible number of winners for this giveaway.
	 * @returns {Giveaway}
	 */
	setPossibleWinners(count) {
		this.winnerCount = count;
		return this;
	}

	/**
	 * Set the channel where the giveaway is being run.
	 * @chainable
	 * @since 4.0.0
	 * @param {string} channelID The channel's ID where the giveaway is being run.
	 * @returns {Giveaway}
	 */
	setChannel(channelID) {
		this.channel = channelID;
		return this;
	}

	/**
	 * Set the duration of the giveaway.
	 * @chainable
	 * @since 4.0.0
	 * @param {Duration} duration Duration for which the giveaway should run.
	 * @returns {Giveaway}
	 */
	setDuration(duration) {
		this.duration = duration;
		return this;
	}

	/**
	 * Set the server of the giveaway and also the giveaway embed message ID.
	 * @chainable
	 * @since 4.0.0
	 * @param {Message} msg message object.
	 * @returns {Giveaway}
	 */
	setGuildMessage(msg) {
		this.guild = msg.guild.id;
		this.message = msg.id;
		return this;
	}

	/**
	 * Set the start time of this giveaway.
	 * @chainable
	 * @since 4.0.0
	 * @returns {Giveaway}
	 */
	setStartTime() {
		this.startTimestamp = Date.now();
		return this;
	}

	/**
	 * Set the end time of this giveaway.
	 * @chainable
	 * @since 4.0.0
	 * @returns {Giveaway}
	 */
	setEndTime() {
		this.endTimestamp = Date.now();
		return this;
	}

	/**
	 * Generate and set the unique ID for this giveaway.
	 * @chainable
	 * @since 4.0.0
	 * @param {Client} client The client instance.
	 * @returns {Giveaway}
	 */
	setID(client) {
		this.id = ScheduledTask._generateID(client);
		return this;
	}

	/**
	 * Get the winners of the giveaway.
	 * @async
	 * @since 4.0.0
	 * @returns {userID[]}
	 */
	async drawWinners() {
		const fetched = [];
		const winners = [];

		while (winners.length < this.winnerCount) {
			// can't have more possible winners than people who entered in the giveaway.
			if (winners.length >= this.users.length) break;

			// The temporary array to hold all users - already fetche users.
			const temp = [];
			for (const user of this.users) {
				if (fetched.filter(usr => usr === user).length < 1) temp.push(user);
			}

			const winner = temp.random();
			fetched.push(winner);

			// checking if the member is still in the guild.
			// TO-BE-DONE verify the broadcastEval
			const memberArray = await this.client.shard.broadcastEval(`
				const guild = this.guilds.get('${this.guild}');
				if (!guild) return null;
				const member = guild.members.fetch('${winner}');
				if (!member) return null;
				return {
					id: member.id,
					tag: member.user.tag
				};
			`);
			const member = memberArray.filter(mem => mem !== null)[0];
			if (member && winners.filter(winnr => winnr.id === member.id).length < 1) winners.push(member);

			// if there is no more possible user in the participated user list then terminate the while loop
			if (temp.length < 1) break;
		}

		this.winners = winners;
		return this;
	}

	/**
	 * Get embed for the final winners declaration
	 * @since 4.0.0
	 * @returns {MessageEmbed} D.js embed with necessary informations
	 */
	getWinnersEmbed() {
		const embed = new MessageEmbed()
			.setColor('RANDOM')
			.setTitle('Giveaway')
			.setDescription('Giveaway has ended successfully.')
			.addField(`Winner${this.winners.length > 1 ? 's' : ''}`, this.arrangeWinners())
			.setFooter(this.id);
		return embed;
	}

	arrangeWinners() {
		return this.winners.map(winner => `<@${winner.id}> (\`${winner.tag}\`)`).join(', ');
	}

	/**
	 * Load this giveaway with data.
	 * @chainable
	 * @since 4.0.0
	 * @param {Object} data The save giveaway data in the client settings.
	 * @returns {Giveaway}
	 */
	loadFromObject(data) {
		const { channel, duration, winnerCount, prize, users, winners, startTimestamp, endTimestamp, id, guild, message } = data;

		this.channel = channel;
		this.duration = duration;
		this.winnerCount = winnerCount;
		this.prize = prize;
		this.users = users;
		this.winners = winners;
		this.startTimestamp = startTimestamp;
		this.endTimestamp = endTimestamp;
		this.id = id;
		this.guild = guild;
		this.message = message;

		return this;
	}

	/**
	 * Convert the giveaway to proper format ready to be saved in client settings.
	 * @since 4.0.0
	 * @returns {Object}
	 */
	toJSON() {
		return {
			channel: this.channel,
			duration: this.duration,
			winnerCount: this.winnerCount,
			prize: this.prize,
			users: this.users,
			winners: this.winners,
			startTimestamp: this.startTimestamp,
			endTimestamp: this.endTimestamp,
			id: this.id,
			guild: this.guild,
			message: this.message
		};
	}

	/**
	 * Add a user to be contestant for giveaway price holder
	 * @since 4.0.0
	 * @static
	 * @param {*} msg D.js message instance
	 * @param {*} user D.js user instance
	 */
	static async addUser(msg, user) {
		const { settings } = msg.client;

		// Checking if the user is already listed as a candidate for the giveaway
		const gAway = settings.giveaways.find(giv => giv.message === msg.id);
		if (gAway.find(usr => usr === user.id)) return;

		// Removing the old giveaway data for that specific message ID.
		// Setting gateaway already does the AI to add/remove depending upon the data is already available on the DB or not.
		await settings.update('giveaways', gAway);

		// adding the new user to the giveaway and adding the updated object to the giveaways
		gAway.users.push(user.id);
		await settings.update('giveaways', gAway);
	}

	/**
	 * Get embed for in-progress giveaway
	 * @since 4.0.0
	 * @static
	 * @param {*} data The giveaway data.
	 * @returns {MessageEmbed} D.js embed with necessary informations
	 */
	static getEmbed(data) {
		return new MessageEmbed()
			.setColor('RANDOM')
			.setTitle('Giveaway')
			.setDescriptions('React with :tada: to participate in this giveaway.')
			.addField('Time remaining', getDuration(data.startTimestamp + data.duration - Date.now()))
			.addField('Prize', data.prize)
			.setFooter(data.id);
	}

}

module.exports = Giveaway;
